"use client";

import { useState } from "react";
import { Task } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";
import AddTaskInput from "./AddTaskInput";
import { useRouter } from "next/navigation";

export default function ListView({
    tasks,
    projectId,
    onTaskCreated,
}: {
    tasks: Task[];
    projectId: string;
    onTaskCreated: () => void;
}) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [openStatus, setOpenStatus] = useState<string | null>(null);
    const router = useRouter();

    function formatDate(dateStr?: string) {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    }

    function priorityColor(priority: string) {
        switch (priority) {
            case "urgent": return "text-danger";
            case "high": return "text-orange-600";
            case "medium": return "text-amber-600";
            case "low": return "text-text-muted";
            default: return "text-text-muted";
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {tasks.length === 0 && (
                <p className="text-sm text-text-muted">No tasks yet — create one to get started.</p>
            )}
            {STATUS_COLUMNS.map((col) => {
                const group = tasks.filter((t) => t.status === col.key);
                const isCollapsed = collapsed[col.key];

                return (
                    <div key={col.key}>
                        <button
                            onClick={() => setCollapsed((prev) => ({ ...prev, [col.key]: !prev[col.key] }))}
                            className="flex items-center gap-1 text-sm font-semibold text-text mb-2"
                        >
                            <span className="text-xs">{isCollapsed ? "▶" : "▼"}</span>
                            {col.label}
                        </button>

                        {!isCollapsed && (
                            <div className="border border-border rounded-lg overflow-hidden mb-2">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-surface-muted text-text-muted text-left">
                                            <th className="px-3 py-2 font-medium">Task</th>
                                            <th className="px-3 py-2 font-medium">Priority</th>
                                            <th className="px-3 py-2 font-medium">Due Date</th>
                                            <th className="px-3 py-2 font-medium w-16">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.map((task) => (
                                            <tr
                                                key={task._id}
                                                onClick={() => router.push(`/tasks/${task._id}`)}
                                                className="border-t border-border hover:bg-surface-muted cursor-pointer"
                                            >
                                                <td className="px-3 py-2 text-text">{task.title}</td>
                                                <td className="px-3 py-2">
                                                    {task.priority && task.priority !== "no-priority" ? (
                                                        <span className={`inline-flex items-center gap-1.5 ${priorityColor(task.priority)}`}>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-text-muted">-</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-text-muted">{formatDate(task.dueDate)}</td>
                                                <td className="px-3 py-2 text-text-muted">⋯</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!isCollapsed && (
                            <AddTaskInput
                                projectId={projectId}
                                status={col.key}
                                onCreated={onTaskCreated}
                                open={openStatus === col.key}
                                onOpenChange={(open) => setOpenStatus(open ? col.key : null)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}