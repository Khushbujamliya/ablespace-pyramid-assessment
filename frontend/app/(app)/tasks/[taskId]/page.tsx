"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTask, updateTask, Task, TaskStatus } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";

export default function TaskDetailPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getTask(taskId)
            .then((t) => {
                setTask(t);
                setTitle(t.title);
                setDescription(t.description ?? "");
            })
            .finally(() => setLoading(false));
    }, [taskId]);

    async function handleFieldSave(updates: Partial<Task>) {
        if (!task) return;
        const updated = { ...task, ...updates };
        setTask(updated);
        await updateTask(task._id, updates);
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading task...
            </div>
        );
    }

    if (!task) return <div className="text-text-muted">Task not found.</div>;

    return (
        <div className="flex gap-8">
            <div className="flex-1 max-w-2xl">
                <button onClick={() => router.back()} className="text-sm text-text-muted mb-4">
                    ← Back
                </button>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => title !== task.title && handleFieldSave({ title })}
                    className="w-full text-2xl font-semibold text-text mb-3 focus:outline-none"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => description !== task.description && handleFieldSave({ description })}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full text-sm text-text-muted mb-6 focus:outline-none resize-none"
                />

                {task.labels && task.labels.length > 0 && (
                    <div className="mb-6">
                        <div className="text-xs text-text-muted mb-2">Labels</div>
                        <div className="flex flex-wrap gap-1">
                            {task.labels.map((label) => (
                                <span key={label} className="text-xs px-2 py-0.5 rounded bg-surface-muted text-text-muted">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-64 border-l border-border pl-6">
                <div className="text-sm font-semibold text-text mb-4">Details</div>

                <div className="flex flex-col gap-4 text-sm">
                    <div>
                        <div className="text-xs text-text-muted mb-1">Status</div>
                        <select
                            value={task.status}
                            onChange={(e) => handleFieldSave({ status: e.target.value as TaskStatus })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        >
                            {STATUS_COLUMNS.map((col) => (
                                <option key={col.key} value={col.key}>{col.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted mb-1">Priority</div>
                        <select
                            value={task.priority || "no-priority"}
                            onChange={(e) => handleFieldSave({ priority: e.target.value })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        >
                            <option value="no-priority">No Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted mb-1">Due Date</div>
                        <input
                            type="date"
                            value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                            onChange={(e) => handleFieldSave({ dueDate: e.target.value })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}