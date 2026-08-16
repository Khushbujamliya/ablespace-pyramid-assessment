"use client";

import { useEffect, useState } from "react";
import { getAllTasks, Task, TaskStatus } from "@/lib/tasks";
import BoardView from "@/components/BoardView";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showFieldsMenu, setShowFieldsMenu] = useState(false);
    const [fields, setFields] = useState({ priority: true, dueDate: true, labels: true });

    function refreshTasks() {
        getAllTasks().then(setTasks);
    }

    useEffect(() => {
        getAllTasks().then(setTasks).finally(() => setLoading(false));
    }, []);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch = !search.trim() || t.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

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
                <div className="flex items-center gap-2">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="border border-border rounded px-2 py-1.5 text-sm"
                    >
                        <option value="all">All Priorities</option>
                        <option value="no-priority">No Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <div className="relative">
                        <button
                            onClick={() => setShowFieldsMenu((prev) => !prev)}
                            className="border border-border rounded px-3 py-1.5 text-sm text-text"
                        >
                            Fields
                        </button>
                        {showFieldsMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg p-2 w-40 z-10">
                                {(["priority", "dueDate", "labels"] as const).map((key) => (
                                    <label key={key} className="flex items-center gap-2 text-sm text-text px-2 py-1.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={fields[key]}
                                            onChange={() => setFields((prev) => ({ ...prev, [key]: !prev[key] }))}
                                        />
                                        {key === "dueDate" ? "Due Date" : key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="border border-border rounded px-3 py-1.5 text-sm w-56 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                <span>{filteredTasks.length} tasks</span>
                <span>·</span>
                <span>{filteredTasks.filter((t) => t.status === "completed").length} completed</span>
                <span>·</span>
                <span className="text-danger">
                    {filteredTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length} overdue
                </span>
            </div>

            <BoardView
                tasks={filteredTasks}
                onTaskUpdated={handleTaskUpdated}
                projectId=""
                onTaskCreated={refreshTasks}
                fields={fields}
            />
        </div>
    );
}