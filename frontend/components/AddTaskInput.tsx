"use client";

import { useState } from "react";
import { TaskStatus, createTask } from "@/lib/tasks";

export default function AddTaskInput({
    projectId,
    status,
    onCreated,
}: {
    projectId: string;
    status: TaskStatus;
    onCreated: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleAdd() {
        if (!title.trim()) return;
        setSaving(true);
        try {
            await createTask(title.trim(), status, projectId);
            setTitle("");
            setOpen(false);
            onCreated();
        } finally {
            setSaving(false);
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="text-sm text-text-muted hover:text-text px-1 py-1"
            >
                + Add Task
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Task title..."
                className="text-sm border border-border rounded px-2 py-1.5 focus:outline-none"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleAdd}
                    disabled={saving}
                    className="text-xs bg-primary text-white rounded px-2 py-1"
                >
                    {saving ? "Adding..." : "Add"}
                </button>
                <button
                    onClick={() => setOpen(false)}
                    className="text-xs text-text-muted px-2 py-1"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}