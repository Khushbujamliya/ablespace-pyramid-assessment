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

function SortableCard({ task, onClick }: { task: Task; onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
}

function Column({
    status,
    label,
    tasks,
    onTaskClick,
}: {
    status: TaskStatus;
    label: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}) {
    const { setNodeRef } = useDroppable({ id: status });
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[220px] bg-surface-muted rounded-lg p-3">
            <h3 className="text-sm font-semibold text-text-muted mb-3">
                {label} <span className="text-xs">({columnTasks.length})</span>
            </h3>
            <SortableContext items={columnTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                    {columnTasks.map((task) => (
                        <SortableCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

export default function BoardView({
    tasks,
    onTaskUpdated,
    onTaskClick,
}: {
    tasks: Task[];
    onTaskUpdated: (taskId: string, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
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
                    <Column key={col.key} status={col.key} label={col.label} tasks={tasks} onTaskClick={onTaskClick} />
                ))}
            </div>
        </DndContext>
    );
}