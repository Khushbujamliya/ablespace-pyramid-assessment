"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";
import TaskModal from "./TaskModal";
import { AvatarStack } from "./Avatar";
import { PriorityBadge } from "./PriorityMenu";
import { IconChevronDown, IconChevronRight, IconMore, IconPlus } from "./icons";
import { FieldsState } from "./FieldsMenu";

function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ListView({
    tasks,
    projectId,
    onTaskCreated,
    fields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false },
}: {
    tasks: Task[];
    projectId: string;
    onTaskCreated: () => void;
    fields?: FieldsState;
}) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [showCreateFor, setShowCreateFor] = useState<TaskStatus | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
                            className="flex items-center gap-1.5 text-sm font-semibold text-text mb-2"
                        >
                            {isCollapsed ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}
                            {col.label}
                        </button>

                        {!isCollapsed && (
                            <div className="border border-border rounded-lg overflow-x-auto mb-2">
                                <table className="w-full text-sm min-w-160">
                                    <thead>
                                        <tr className="bg-surface-muted text-text-muted text-left">
                                            <th className="px-3 py-2 font-medium whitespace-nowrap">Task</th>
                                            {fields.priority && <th className="px-3 py-2 font-medium whitespace-nowrap">Priority</th>}
                                            {fields.members && <th className="px-3 py-2 font-medium whitespace-nowrap">Members</th>}
                                            {fields.dueDate && <th className="px-3 py-2 font-medium whitespace-nowrap">Due Date</th>}
                                            {fields.labels && <th className="px-3 py-2 font-medium whitespace-nowrap">Labels</th>}
                                            {fields.status && <th className="px-3 py-2 font-medium whitespace-nowrap">Status</th>}
                                            {fields.reporter && <th className="px-3 py-2 font-medium whitespace-nowrap">Reporter</th>}
                                            <th className="px-3 py-2 font-medium w-16 whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.map((task) => (
                                            <tr
                                                key={task._id}
                                                onClick={() => setSelectedTask(task)}
                                                className="border-t border-border hover:bg-surface-muted cursor-pointer"
                                            >
                                                <td className="px-3 py-2 text-text whitespace-nowrap">{task.title}</td>
                                                {fields.priority && (
                                                    <td className="px-3 py-2"><PriorityBadge priority={task.priority} /></td>
                                                )}
                                                {fields.members && (
                                                    <td className="px-3 py-2">
                                                        {task.members && task.members.length > 0 ? (
                                                            <AvatarStack
                                                                people={task.members.map((m) => ({ name: m.fullName || m.username, src: m.avatar }))}
                                                                size={22}
                                                            />
                                                        ) : (
                                                            <span className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-text-muted">
                                                                <IconPlus size={11} />
                                                            </span>
                                                        )}
                                                    </td>
                                                )}
                                                {fields.dueDate && (
                                                    <td className="px-3 py-2 text-text-muted whitespace-nowrap">{formatDate(task.dueDate)}</td>
                                                )}
                                                {fields.labels && (
                                                    <td className="px-3 py-2 text-text-muted">
                                                        {task.labels && task.labels.length > 0 ? task.labels.join(", ") : "-"}
                                                    </td>
                                                )}
                                                {fields.status && (
                                                    <td className="px-3 py-2 text-text-muted">{col.label}</td>
                                                )}
                                                {fields.reporter && (
                                                    <td className="px-3 py-2 text-text-muted">
                                                        {task.reporter?.fullName || task.reporter?.username || "-"}
                                                    </td>
                                                )}
                                                <td className="px-3 py-2 text-text-muted">
                                                    <IconMore size={14} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!isCollapsed && projectId && (
                            <button
                                onClick={() => setShowCreateFor(col.key)}
                                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text px-1 py-1"
                            >
                                <IconPlus size={13} /> Add Task
                            </button>
                        )}
                    </div>
                );
            })}

            {showCreateFor && (
                <TaskModal
                    mode="create"
                    defaultStatus={showCreateFor}
                    projectId={projectId}
                    onClose={() => setShowCreateFor(null)}
                    onSaved={onTaskCreated}
                />
            )}

            {selectedTask && (
                <TaskModal
                    mode="edit"
                    task={selectedTask}
                    projectId={projectId}
                    onClose={() => setSelectedTask(null)}
                    onSaved={onTaskCreated}
                />
            )}
        </div>
    );
}
