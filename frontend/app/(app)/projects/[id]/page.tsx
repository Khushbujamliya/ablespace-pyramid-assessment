"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectTasks, Task, TaskStatus } from "@/lib/tasks";
import ListView from "@/components/ListView";
import BoardView from "@/components/BoardView";


export default function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<"list" | "board">("list");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjectTasks(id)
            .then(setTasks)
            .finally(() => setLoading(false));
    }, [id]);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    if (loading) return <div className="text-text-muted">Loading tasks...</div>;

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setView("list")}
                    className={view === "list" ? "font-semibold text-primary" : "text-text-muted"}
                >
                    List
                </button>
                <button
                    onClick={() => setView("board")}
                    className={view === "board" ? "font-semibold text-primary" : "text-text-muted"}
                >
                    Board
                </button>
            </div>
            {view === "list" ? (
                <ListView tasks={tasks} />
            ) : (
                <BoardView tasks={tasks} onTaskUpdated={handleTaskUpdated} />
            )}
        </div>
    );
}
