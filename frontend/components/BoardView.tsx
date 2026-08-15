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
import AddTaskInput from "./AddTaskInput";
import { useState } from "react";

function SortableCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} />
        </div>
    );
}

function Column({
    status,
    label,
    tasks,
    projectId,
    onTaskCreated,
}: {
    status: TaskStatus;
    label: string;
    tasks: Task[];
    projectId: string;
    onTaskCreated: () => void;
}) {
    const { setNodeRef } = useDroppable({ id: status });
    const columnTasks = tasks.filter((t) => t.status === status);
    const [addOpen, setAddOpen] = useState(false);

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[220px] bg-surface-muted rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-muted">
                    {label} <span className="text-xs">({columnTasks.length})</span>
                </h3>
                <div className="flex items-center gap-1 text-text-muted">
                    {projectId && (
                        <button
                            onClick={() => setAddOpen(true)}
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
                    {columnTasks.map((task) => (
                        <SortableCard key={task._id} task={task} />
                    ))}
                </div>
            </SortableContext>
            {projectId && (
                <AddTaskInput
                    projectId={projectId}
                    status={status}
                    onCreated={onTaskCreated}
                    open={addOpen}
                    onOpenChange={setAddOpen}
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
}: {
    tasks: Task[];
    onTaskUpdated: (taskId: string, status: TaskStatus) => void;
    projectId: string;
    onTaskCreated: () => void;
}) {
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
                    />
                ))}
            </div>
        </DndContext>
    );
}