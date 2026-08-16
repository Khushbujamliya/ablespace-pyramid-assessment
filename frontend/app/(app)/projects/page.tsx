"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject, deleteProject, updateProject, Project } from "@/lib/projects";

function priorityColor(priority?: string) {
    switch (priority) {
        case "urgent": return "text-danger";
        case "high": return "text-orange-600";
        case "medium": return "text-amber-600";
        case "low": return "text-text-muted";
        default: return "text-text-muted";
    }
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredProjects = projects.filter((p) => {
        const matchesSearch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === "all" || p.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    function refreshProjects() {
        getProjects().then(setProjects);
    }

    useEffect(() => {
        getProjects().then(setProjects).finally(() => setLoading(false));
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            await createProject(newName.trim());
            setNewName("");
            setShowCreate(false);
            refreshProjects();
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteProject(id: string) {
        const confirmed = window.confirm("Delete this project? This can't be undone.");
        if (!confirmed) return;
        await deleteProject(id);
        setOpenMenuId(null);
        refreshProjects();
    }

    async function handleAssignLead(projectId: string) {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const user = JSON.parse(stored);
        await updateProject(projectId, { lead: user.id } as any);
        refreshProjects();
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading projects...
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Projects</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="border border-border rounded pl-8 pr-3 py-1.5 text-sm w-48 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu((prev) => !prev)}
                            className="border border-border rounded px-2.5 py-1.5 text-sm text-text-muted"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </button>
                        {showFilterMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg p-2 w-40 z-10">
                                {["all", "no-priority", "low", "medium", "high", "urgent"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => { setPriorityFilter(p); setShowFilterMenu(false); }}
                                        className="w-full text-left text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                                    >
                                        {p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Project
                    </button>
                </div>
            </div>

            {filteredProjects.length === 0 && (
                <p className="text-sm text-text-muted">No projects found.</p>
            )}

            {filteredProjects.length > 0 && (
                <div className="border border-border rounded-lg shadow-md overflow-visible">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-border text-text-muted text-left">
                                <th className="px-3 py-2 font-medium">Project</th>
                                <th className="px-3 py-2 font-medium">Priority</th>
                                <th className="px-3 py-2 font-medium">Lead</th>
                                <th className="px-3 py-2 font-medium">Due Date</th>
                                <th className="px-3 py-2 font-medium w-16">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr
                                    key={project._id}
                                    onClick={() => router.push(`/projects/${project._id}`)}
                                    className="bg-surface border-t border-border hover:bg-surface-muted cursor-pointer transition-colors"
                                >
                                    <td className="px-3 py-2 text-text">{project.name}</td>
                                    <td className="px-3 py-2">
                                        {project.priority ? (
                                            <span className={`inline-flex items-center gap-1.5 ${priorityColor(project.priority)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                                            </span>
                                        ) : (
                                            <span className="text-text-muted">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-text-muted" onClick={(e) => e.stopPropagation()}>
                                        {project.lead?.fullName || project.lead?.username ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center">
                                                    {(project.lead.fullName || project.lead.username || "?")[0].toUpperCase()}
                                                </span>
                                                {project.lead.fullName || project.lead.username}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleAssignLead(project._id)}
                                                className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-xs hover:border-primary hover:text-primary"
                                            >
                                                +
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-text-muted">
                                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "-"}
                                    </td>
                                    <td className="px-3 py-2 relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === project._id ? null : project._id)}
                                            className="text-text-muted hover:bg-surface-muted rounded px-1"
                                        >
                                            ⋯
                                        </button>
                                        {openMenuId === project._id && (
                                            <div className="absolute right-2 top-8 z-20 bg-surface border border-border rounded-lg shadow-lg w-32 overflow-hidden">
                                                <button
                                                    onClick={() => { router.push(`/projects/${project._id}`); setOpenMenuId(null); }}
                                                    className="w-full text-left text-sm text-text px-3 py-2 hover:bg-surface-muted"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project._id)}
                                                    className="w-full text-left text-sm text-danger px-3 py-2 hover:bg-danger/10"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
                    <div className="bg-surface rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-text mb-4">Add Project</h2>
                        <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            placeholder="Project name"
                            className="w-full border border-border rounded px-3 py-2 text-sm mb-4 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowCreate(false)} className="text-sm text-text-muted px-4 py-2">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-2 rounded disabled:opacity-60"
                            >
                                {saving ? "Adding..." : "Add Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}