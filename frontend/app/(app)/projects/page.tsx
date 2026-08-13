"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, Project } from "@/lib/projects";

export default function ProjectsPage() {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 && (
                    <p className="text-sm text-text-muted">No projects yet.</p>
                )}
                {projects.map((project) => (
                    <Link
                        key={project._id}
                        href={`/projects/${project._id}`}
                        className="bg-surface border border-border rounded-lg p-4 hover:border-primary/40"
                    >
                        <p className="text-sm font-medium text-text">{project.name}</p>
                        {project.priority && (
                            <span className="text-xs text-text-muted mt-1 inline-block">{project.priority}</span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}