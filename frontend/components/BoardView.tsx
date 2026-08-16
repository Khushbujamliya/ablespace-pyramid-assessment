"use client";

import {
    DndContext,
    DragEndEvent,
    closestCorners,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus, updateTaskStatus } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
    backlog: "#6B7280",
    todo: "#4F46E5",
    doing: "#D97706",
    completed: "#16A34A",
    onhold: "#DC2626",
};

type FieldsVisibility = { priority: boolean; dueDate: boolean; labels: boolean };

function SortableCard({ task, onClick, fields }: { task: Task; onClick: () => void; fields: FieldsVisibility }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard
                task={task}
                onClick={onClick}
                showPriority={fields.priority}
                showDueDate={fields.dueDate}
                showLabels={fields.labels}
            />
        </div>
    );
}

function Column({
    status,
    label,
    tasks,
    projectId,
    onTaskCreated,
    onTaskClick,
    fields,
}: {
    status: TaskStatus;
    label: string;
    tasks: Task[];
    projectId: string;
    onTaskCreated: () => void;
    onTaskClick: (task: Task) => void;
    fields: FieldsVisibility;
}) {
    const { setNodeRef } = useDroppable({ id: status });
    const columnTasks = tasks.filter((t) => t.status === status);
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div
            ref={setNodeRef}
            style={{ borderTopColor: STATUS_COLORS[status] || "#6B7280", borderTopWidth: "3px" }}
            className="flex-1 min-w-[240px] bg-surface-muted rounded-lg p-3 border-t"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[status] || "#6B7280" }}
                    ></span>
                    {label} <span className="text-xs">({columnTasks.length})</span>
                </h3>
                <div className="flex items-center gap-1 text-text-muted">
                    {projectId && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface text-sm leading-none"
                        >
                            +
                        </button>
                    )}
                    <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface text-sm leading-none">⋯</button>
                </div>
            </div>
            <SortableContext items={columnTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2 mb-2">
                    {columnTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-text-muted opacity-60">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                            </svg>
                            <p className="text-xs mt-2">Nothing here yet</p>
                        </div>
                    )}
                    {columnTasks.map((task) => (
                        <SortableCard key={task._id} task={task} onClick={() => onTaskClick(task)} fields={fields} />
                    ))}
                </div>
            </SortableContext>
            {projectId && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm text-text-muted hover:text-text px-1 py-1"
                >
                    + Add Task
                </button>
            )}

            {showCreateModal && (
                <TaskModal
                    mode="create"
                    defaultStatus={status}
                    projectId={projectId}
                    onClose={() => setShowCreateModal(false)}
                    onSaved={onTaskCreated}
                />
            )}
        </div>
    );
}

export default function BoardView({
    tasks,
    onTaskUpdated,
    projectId,
    onTaskCreated,
    fields = { priority: true, dueDate: true, labels: true },
}: {
    tasks: Task[];
    onTaskUpdated: (taskId: string, status: TaskStatus) => void;
    projectId: string;
    onTaskCreated: () => void;
    fields?: FieldsVisibility;
}) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id as string;
        const overId = over.id as string;
        const validStatuses = STATUS_COLUMNS.map((c) => c.key);
        if (!validStatuses.includes(overId as TaskStatus)) return;
        const newStatus = overId as TaskStatus;
        const task = tasks.find((t) => t._id === taskId);
        if (!task || task.status === newStatus) return;
        onTaskUpdated(taskId, newStatus);
        try {
            await updateTaskStatus(taskId, newStatus);
        } catch {
            onTaskUpdated(taskId, task.status);
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {tasks.length === 0 && (
                    <p className="text-sm text-text-muted">No tasks yet — create one to get started.</p>
                )}
                {STATUS_COLUMNS.map((col) => (
                    <Column
                        key={col.key}
                        status={col.key}
                        label={col.label}
                        tasks={tasks}
                        projectId={projectId}
                        onTaskCreated={onTaskCreated}
                        onTaskClick={setSelectedTask}
                        fields={fields}
                    />
                ))}
            </div>

            {selectedTask && (
                <TaskModal
                    mode="edit"
                    task={selectedTask}
                    projectId={projectId}
                    onClose={() => setSelectedTask(null)}
                    onSaved={onTaskCreated}
                />
            )}
        </DndContext>
    );
}