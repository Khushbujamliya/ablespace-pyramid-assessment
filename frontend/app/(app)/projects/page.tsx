"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, Project } from "@/lib/projects";

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

    useEffect(() => {
        getProjects().then(setProjects).finally(() => setLoading(false));
    }, []);

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
            <h1 className="text-lg font-semibold mb-4">Projects</h1>

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
        </div>
    );
}