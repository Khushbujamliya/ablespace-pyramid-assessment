"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProjectTasks, Task, TaskStatus } from "@/lib/tasks";
import { getProject, Project } from "@/lib/projects";
import BoardView from "@/components/BoardView";

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    function refreshTasks() {
        getProjectTasks(id).then(setTasks);
    }

    useEffect(() => {
        Promise.all([getProjectTasks(id), getProject(id)])
            .then(([t, p]) => {
                setTasks(t);
                setProject(p);
            })
            .finally(() => setLoading(false));
    }, [id]);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading project...
            </div>
        );
    }

    const completedCount = tasks.filter((t) => t.status === "completed").length;

    return (
        <div>
            <Link href="/projects" className="text-sm text-primary hover:underline mb-3 inline-block">
                ← Back
            </Link>

            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-semibold text-text">{project?.name || "Project"}</h1>
            </div>

            <div className="flex items-center gap-3 mb-5 text-sm text-text-muted">
                <span>{tasks.length} tasks</span>
                <span>·</span>
                <span>{completedCount} completed</span>
            </div>

            <BoardView
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                projectId={id}
                onTaskCreated={refreshTasks}
            />
        </div>
    );
}