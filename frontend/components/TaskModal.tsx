"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";

export default function TaskModal({
    task,
    onClose,
    onSave,
}: {
    task: Task;
    onClose: () => void;
    onSave: (taskId: string, updates: Partial<Task>) => Promise<void>;
}) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(task._id, { title, description, status });
            onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-lg p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-lg font-semibold mb-3 border-b border-border pb-2 focus:outline-none"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={4}
                    className="w-full text-sm text-text-muted mb-4 border border-border rounded p-2 focus:outline-none"
                />

                <div className="mb-4">
                    <label className="text-xs text-text-muted block mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        className="border border-border rounded px-2 py-1 text-sm"
                    >
                        {STATUS_COLUMNS.map((col) => (
                            <option key={col.key} value={col.key}>
                                {col.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="text-sm text-text-muted px-3 py-1.5">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-1.5 rounded disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}