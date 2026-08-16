"use client";

import { useEffect, useState } from "react";
import { getAllTasks, Task, TaskStatus } from "@/lib/tasks";
import BoardView from "@/components/BoardView";
import { getProjects } from "@/lib/projects";
import TaskModal from "@/components/TaskModal";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showFieldsMenu, setShowFieldsMenu] = useState(false);
    const [fields, setFields] = useState({ priority: true, dueDate: true, labels: true });
    const [defaultProjectId, setDefaultProjectId] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    function refreshTasks() {
        getAllTasks().then(setTasks);
    }

    useEffect(() => {
        getAllTasks().then(setTasks).finally(() => setLoading(false));
        getProjects().then((projects) => {
            if (projects.length > 0) setDefaultProjectId(projects[0]._id);
        });
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
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </span>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="border border-border rounded pl-7 pr-2 py-1.5 text-sm appearance-none"
                        >
                            <option value="all">All Priorities</option>
                            <option value="no-priority">No Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowFieldsMenu((prev) => !prev)}
                            className="border border-border rounded px-3 py-1.5 text-sm text-text flex items-center gap-1.5"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="18" rx="1" />
                                <rect x="14" y="3" width="7" height="18" rx="1" />
                            </svg>
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

                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="border border-border rounded pl-8 pr-3 py-1.5 text-sm w-56 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Task
                    </button>
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
                projectId={defaultProjectId}
                onTaskCreated={refreshTasks}
                fields={fields}
            />

            {showCreateModal && (
                <TaskModal
                    mode="create"
                    defaultStatus="todo"
                    projectId={defaultProjectId}
                    onClose={() => setShowCreateModal(false)}
                    onSaved={refreshTasks}
                />
            )}
        </div>
    );
}