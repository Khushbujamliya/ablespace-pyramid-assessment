"use client";

import { useEffect, useState } from "react";
import { getAllTasks, Task, TaskStatus } from "@/lib/tasks";
import BoardView from "@/components/BoardView";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    function refreshTasks() {
        getAllTasks().then(setTasks);
    }

    useEffect(() => {
        getAllTasks().then(setTasks).finally(() => setLoading(false));
    }, []);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    const filteredTasks = search.trim()
        ? tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
        : tasks;

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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Tasks</h1>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="border border-border rounded px-3 py-1.5 text-sm w-56 focus:outline-none"
                />
            </div>
            <BoardView
                tasks={filteredTasks}
                onTaskUpdated={handleTaskUpdated}
                projectId=""
                onTaskCreated={refreshTasks}
            />
        </div>
    );
}