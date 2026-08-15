"use client";

import { useEffect, useState } from "react";
import { getAllTasks, Task, TaskStatus } from "@/lib/tasks";
import BoardView from "@/components/BoardView";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    function refreshTasks() {
        getAllTasks().then(setTasks);
    }

    useEffect(() => {
        getAllTasks().then(setTasks).finally(() => setLoading(false));
    }, []);

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
            <h1 className="text-lg font-semibold mb-4">Tasks</h1>
            <BoardView
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                projectId=""
                onTaskCreated={refreshTasks}
            />
        </div>
    );
}