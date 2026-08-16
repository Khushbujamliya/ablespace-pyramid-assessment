"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTasks, Task } from "@/lib/tasks";
import { getProjects, Project } from "@/lib/projects";
import { STATUS_COLUMNS } from "@/lib/taskStatus";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllTasks(), getProjects()])
            .then(([t, p]) => {
                setTasks(t);
                setProjects(p);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading dashboard...
            </div>
        );
    }

    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const overdueCount = tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length;
    const recentTasks = [...tasks]
        .sort((a, b) => (b._id > a._id ? 1 : -1))
        .slice(0, 5);

    return (
        <div>
            <h1 className="text-lg font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div style={{ borderTopColor: "#4F46E5", borderTopWidth: "3px" }} className="bg-surface border border-border rounded-lg shadow-md p-4">
                    <p className="text-xs text-text-muted mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold text-text">{tasks.length}</p>
                </div>
                <div style={{ borderTopColor: "#16A34A", borderTopWidth: "3px" }} className="bg-surface border border-border rounded-lg shadow-md p-4">
                    <p className="text-xs text-text-muted mb-1">Completed</p>
                    <p className="text-3xl font-bold text-text">{completedCount}</p>
                </div>
                <div style={{ borderTopColor: "#DC2626", borderTopWidth: "3px" }} className="bg-surface border border-border rounded-lg shadow-md p-4">
                    <p className="text-xs text-text-muted mb-1">Overdue</p>
                    <p className="text-3xl font-bold text-danger">{overdueCount}</p>
                </div>
                <div style={{ borderTopColor: "#D97706", borderTopWidth: "3px" }} className="bg-surface border border-border rounded-lg shadow-md p-4">
                    <p className="text-xs text-text-muted mb-1">Projects</p>
                    <p className="text-3xl font-bold text-text">{projects.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-text">Recent Tasks</h2>
                        <Link href="/tasks" className="text-xs text-primary hover:underline">View all</Link>
                    </div>
                    {recentTasks.length === 0 && (
                        <p className="text-sm text-text-muted">No tasks yet.</p>
                    )}
                    <div className="flex flex-col gap-2">
                        {recentTasks.map((task) => (
                            <Link
                                key={task._id}
                                href={`/tasks/${task._id}`}
                                className="bg-surface border border-border rounded-lg shadow p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm text-text flex items-center justify-between"
                            >
                                <span>{task.title}</span>
                                <span className="text-xs text-text-muted">
                                    {STATUS_COLUMNS.find((c) => c.key === task.status)?.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-text">Projects</h2>
                        <Link href="/projects" className="text-xs text-primary hover:underline">View all</Link>
                    </div>
                    {projects.length === 0 && (
                        <p className="text-sm text-text-muted">No projects yet.</p>
                    )}
                    <div className="flex flex-col gap-2">
                        {projects.slice(0, 5).map((project) => (
                            <Link
                                key={project._id}
                                href={`/projects/${project._id}`}
                                className="bg-surface border border-border rounded-lg p-3 hover:border-primary/40 text-sm text-text"
                            >
                                {project.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}