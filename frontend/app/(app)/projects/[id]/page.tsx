"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProjectTasks, Task, TaskStatus } from "@/lib/tasks";
import ListView from "@/components/ListView";
import BoardView from "@/components/BoardView";

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<"list" | "board">("list");
    const [loading, setLoading] = useState(true);

    function refreshTasks() {
        getProjectTasks(id).then(setTasks);
    }

    useEffect(() => {
        getProjectTasks(id).then(setTasks).finally(() => setLoading(false));
    }, [id]);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading tasks...
            </div>
        );
    }

    return (
        <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline mb-3 inline-block">
                ← Dashboard
            </Link>
            <div className="flex gap-2 mb-4">
                <button onClick={() => setView("list")} className={view === "list" ? "font-semibold text-primary" : "text-text-muted"}>
                    List
                </button>
                <button onClick={() => setView("board")} className={view === "board" ? "font-semibold text-primary" : "text-text-muted"}>
                    Board
                </button>
            </div>

            {view === "list" ? (
                <ListView tasks={tasks} projectId={id} onTaskCreated={refreshTasks} />
            ) : (
                <BoardView
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    projectId={id}
                    onTaskCreated={refreshTasks}
                />
            )}
        </div>
    );
}