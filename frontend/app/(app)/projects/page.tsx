"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { getProjects, createProject, deleteProject, updateProject, Project } from "@/lib/projects";
import Avatar from "@/components/Avatar";
import PriorityMenu, { PriorityBadge } from "@/components/PriorityMenu";
import { IconFilter, IconMore, IconPencil, IconPlus, IconSearch, IconTrash } from "@/components/icons";

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
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!openMenuId) return;
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h1 className="text-lg font-semibold">Projects</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            <IconSearch size={14} />
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="border border-border rounded pl-8 pr-3 py-1.5 text-sm w-32 sm:w-48 focus:outline-none"
                        />
                    </div>

                    <PriorityMenu
                        value={priorityFilter === "all" ? undefined : priorityFilter}
                        allowAll
                        open={showFilterMenu}
                        onOpenChange={setShowFilterMenu}
                        onSelect={(p) => setPriorityFilter(p)}
                        align="right"
                        trigger={
                            <button className="border border-border rounded px-2.5 py-1.5 text-sm text-text-muted flex items-center gap-1">
                                <IconFilter size={14} />
                            </button>
                        }
                    />

                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-black hover:bg-black/90 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5"
                    >
                        <IconPlus size={14} />
                        Add Project
                    </button>
                </div>
            </div>

            {filteredProjects.length === 0 && (
                <p className="text-sm text-text-muted">No projects found.</p>
            )}

            {filteredProjects.length > 0 && (
                <div className="border border-border rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm min-w-160">
                        <thead>
                            <tr className="bg-surface border-b border-border text-text-muted text-left">
                                <th className="px-3 py-2 font-medium whitespace-nowrap">Project</th>
                                <th className="px-3 py-2 font-medium whitespace-nowrap">Priority</th>
                                <th className="px-3 py-2 font-medium whitespace-nowrap">Lead</th>
                                <th className="px-3 py-2 font-medium whitespace-nowrap">Due Date</th>
                                <th className="px-3 py-2 font-medium w-16 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr
                                    key={project._id}
                                    onClick={() => router.push(`/projects/${project._id}`)}
                                    className="bg-surface border-t border-border hover:bg-surface-muted cursor-pointer transition-colors"
                                >
                                    <td className="px-3 py-2 text-text whitespace-nowrap">{project.name}</td>
                                    <td className="px-3 py-2">
                                        <PriorityBadge priority={project.priority} />
                                    </td>
                                    <td className="px-3 py-2 text-text-muted whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        {project.lead?.fullName || project.lead?.username ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Avatar name={project.lead.fullName || project.lead.username} size={22} />
                                                {project.lead.fullName || project.lead.username}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleAssignLead(project._id)}
                                                className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary"
                                            >
                                                <IconPlus size={12} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-text-muted whitespace-nowrap">
                                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "-"}
                                    </td>
                                    <td className="px-3 py-2 relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setMenuPos({ top: rect.bottom + 4, left: rect.right - 128 });
                                                setOpenMenuId(openMenuId === project._id ? null : project._id);
                                            }}
                                            className="text-text-muted hover:bg-surface-muted rounded p-1"
                                        >
                                            <IconMore size={14} />
                                        </button>
                                        {openMenuId === project._id && createPortal(
                                            <div
                                                ref={menuRef}
                                                style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                                                className="z-50 bg-surface border border-border rounded-lg shadow-lg w-32 overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => { router.push(`/projects/${project._id}`); setOpenMenuId(null); }}
                                                    className="w-full text-left text-sm text-text px-3 py-2 hover:bg-surface-muted flex items-center gap-2"
                                                >
                                                    <IconPencil size={13} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project._id)}
                                                    className="w-full text-left text-sm text-danger px-3 py-2 hover:bg-danger/10 flex items-center gap-2"
                                                >
                                                    <IconTrash size={13} /> Delete
                                                </button>
                                            </div>,
                                            document.body
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
                                className="bg-black hover:bg-black/90 text-white text-sm px-4 py-2 rounded disabled:opacity-60"
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