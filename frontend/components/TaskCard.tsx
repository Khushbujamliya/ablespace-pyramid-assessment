"use client";

import { useState, useEffect, useRef } from "react";
import { Task, deleteTask } from "@/lib/tasks";
import { createPortal } from "react-dom";
import Avatar from "./Avatar";
import { IconMore, IconPencil, IconTrash, IconTag } from "./icons";

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
    const assignee = task.members?.[0] || task.reporter;
    const assigneeName = assignee?.fullName || assignee?.username;
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!menuOpen) return;
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <div
            onClick={onClick}
            style={{ borderLeftColor: priorityBorderColor(task.priority), borderLeftWidth: "3px" }}
            className="relative bg-surface border border-border rounded-lg p-3 shadow cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
        >
            <div className="flex items-start justify-between gap-2 mb-2.5">
                <p className="text-sm font-medium text-text leading-snug">{task.title}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuPos({ top: e.clientY + 4, left: e.clientX - 100 });
                        setMenuOpen((prev) => !prev);
                    }}
                    className="text-text-muted flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-surface-muted rounded"
                >
                    <IconMore size={14} />
                </button>
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
                {assigneeName ? (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar name={assigneeName} src={assignee?.avatar} size={20} />
                        <span className="text-xs text-text-muted truncate">{assigneeName}</span>
                    </div>
                ) : <span />}
                {showDueDate && formattedDate && (
                    <span className="text-xs px-2 py-0.5 rounded bg-danger/10 text-danger whitespace-nowrap flex-shrink-0">
                        {formattedDate}
                    </span>
                )}
            </div>

            {menuOpen && createPortal(
                <div
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                    className="z-50 bg-surface border border-border rounded-lg shadow-lg w-32 overflow-hidden"
                >
                    <button
                        onClick={handleEdit}
                        className="w-full text-left text-sm text-text px-3 py-2 hover:bg-surface-muted flex items-center gap-2"
                    >
                        <IconPencil size={13} /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full text-left text-sm text-danger px-3 py-2 hover:bg-danger/10 flex items-center gap-2 disabled:opacity-60"
                    >
                        <IconTrash size={13} /> {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>,
                document.body
            )}

            <div className="flex flex-wrap gap-1.5">
                {showPriority && task.priority && task.priority !== "no-priority" && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary capitalize">
                        {task.priority}
                    </span>
                )}
                {showLabels && task.labels?.map((label) => (
                    <span key={label} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-surface-muted text-text-muted">
                        <IconTag size={10} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}