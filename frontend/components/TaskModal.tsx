"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus, createTask, updateTask } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";

export default function TaskModal({
    mode,
    task,
    defaultStatus,
    projectId,
    onClose,
    onSaved,
}: {
    mode: "create" | "edit";
    task?: Task;
    defaultStatus?: TaskStatus;
    projectId: string;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");
    const [priority, setPriority] = useState("no-priority");
    const [dueDate, setDueDate] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (mode === "edit" && task) {
            setTitle(task.title);
            setDescription(task.description ?? "");
            setStatus(task.status);
            setPriority(task.priority ?? "no-priority");
            setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
        } else if (mode === "create" && defaultStatus) {
            setStatus(defaultStatus);
        }
    }, [mode, task, defaultStatus]);

    async function handleSubmit() {
        if (!title.trim()) return;
        setSaving(true);
        try {
            if (mode === "create") {
                await createTask(title.trim(), status, projectId);
            } else if (task) {
                await updateTask(task._id, {
                    title: title.trim(),
                    description,
                    status,
                    priority,
                    dueDate: dueDate || undefined,
                });
            }
            onSaved();
            onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-surface rounded-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text">
                        {mode === "create" ? "Add Task" : "Edit Task"}
                    </h2>
                    <button onClick={onClose} className="text-text-muted text-xl leading-none">×</button>
                </div>

                <label className="text-sm text-text mb-1 block">Title *</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full border border-border rounded px-3 py-2 text-sm mb-4 focus:outline-none"
                />

                <label className="text-sm text-text mb-1 block">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full border border-border rounded px-3 py-2 text-sm mb-4 focus:outline-none resize-none"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm text-text mb-1 block">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            className="w-full border border-border rounded px-2 py-2 text-sm"
                        >
                            {STATUS_COLUMNS.map((col) => (
                                <option key={col.key} value={col.key}>{col.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-text mb-1 block">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full border border-border rounded px-2 py-2 text-sm"
                        >
                            <option value="no-priority">No Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <label className="text-sm text-text mb-1 block">Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2 text-sm mb-6"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="text-sm text-text-muted px-4 py-2">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-2 rounded disabled:opacity-60"
                    >
                        {saving ? "Saving..." : mode === "create" ? "Add Task" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}