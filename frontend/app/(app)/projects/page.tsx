"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject, Project } from "@/lib/projects";

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
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-primary hover:bg-primary-hover text-white text-sm px-3 py-1.5 rounded"
                >
                    + Add Project
                </button>
            </div>

            {projects.length === 0 && (
                <p className="text-sm text-text-muted">No projects yet.</p>
            )}

            {projects.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-muted text-text-muted text-left">
                                <th className="px-3 py-2 font-medium">Project</th>
                                <th className="px-3 py-2 font-medium">Priority</th>
                                <th className="px-3 py-2 font-medium w-16">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr
                                    key={project._id}
                                    onClick={() => router.push(`/projects/${project._id}`)}
                                    className="border-t border-border hover:bg-surface-muted cursor-pointer"
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
                                    <td className="px-3 py-2 text-text-muted">⋯</td>
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