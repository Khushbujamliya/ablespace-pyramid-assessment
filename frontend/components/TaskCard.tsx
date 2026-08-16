"use client";

import { useState } from "react";
import { Task, deleteTask } from "@/lib/tasks";

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

function priorityBorderColor(priority?: string) {
    switch (priority) {
        case "urgent": return "#DC2626";
        case "high": return "#EA580C";
        case "medium": return "#D97706";
        case "low": return "#6B7280";
        default: return "transparent";
    }
}

export default function TaskCard({
    task,
    onClick,
    onDeleted,
    showPriority = true,
    showDueDate = true,
    showLabels = true,
}: {
    task: Task;
    onClick?: () => void;
    onDeleted?: () => void;
    showPriority?: boolean;
    showDueDate?: boolean;
    showLabels?: boolean;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const formattedDate = formatDate(task.dueDate);
    const assigneeName = task.reporter?.fullName || task.reporter?.username;
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        const confirmed = window.confirm("Delete this task? This can't be undone.");
        if (!confirmed) return;
        setDeleting(true);
        try {
            await deleteTask(task._id);
            setMenuOpen(false);
            onDeleted?.();
        } finally {
            setDeleting(false);
        }
    }

    function handleEdit(e: React.MouseEvent) {
        e.stopPropagation();
        setMenuOpen(false);
        onClick?.();
    }

    return (
        <div
            onClick={onClick}
            style={{ borderLeftColor: priorityBorderColor(task.priority), borderLeftWidth: "3px" }}
            className="relative bg-surface border border-border rounded-lg p-3 shadow cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                    {assigneeName && (
                        <div
                            className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0"
                            title={assigneeName}
                        >
                            {assigneeName[0].toUpperCase()}
                        </div>
                    )}
                    <p className="text-sm font-medium text-text">{task.title}</p>
                </div>
                <div className="flex items-center gap-1">
                    {showDueDate && formattedDate && (
                        <span className="text-xs px-2 py-0.5 rounded bg-danger/10 text-danger whitespace-nowrap">
                            {formattedDate}
                        </span>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 4, left: rect.right - 128 });
                            setMenuOpen((prev) => !prev);
                        }}
                        className="text-text-muted text-sm px-1 hover:bg-surface-muted rounded"
                    >
                        ⋯
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                    className="z-50 bg-surface border border-border rounded-lg shadow-lg w-32 overflow-hidden"
                >
                    <button
                        onClick={handleEdit}
                        className="w-full text-left text-sm text-text px-3 py-2 hover:bg-surface-muted flex items-center gap-2"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full text-left text-sm text-danger px-3 py-2 hover:bg-danger/10 flex items-center gap-2 disabled:opacity-60"
                    >
                        🗑️ {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            )}

            <div className="flex flex-wrap gap-1">
                {showPriority && task.priority && task.priority !== "no-priority" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {task.priority}
                    </span>
                )}
                {showLabels && task.labels?.map((label) => (
                    <span key={label} className="text-xs px-2 py-0.5 rounded bg-surface-muted text-text-muted">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}