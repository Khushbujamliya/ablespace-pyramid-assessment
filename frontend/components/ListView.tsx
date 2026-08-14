import { Task } from "@/lib/tasks";
import { STATUS_COLUMNS } from "@/lib/taskStatus";
import TaskCard from "./TaskCard";
import AddTaskInput from "./AddTaskInput";

export default function ListView({
    tasks,
    onTaskClick,
    projectId,
    onTaskCreated,
}: {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    projectId: string;
    onTaskCreated: () => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            {tasks.length === 0 && (
                <p className="text-sm text-text-muted">No tasks yet — create one to get started.</p>
            )}
            {STATUS_COLUMNS.map((col) => {
                const group = tasks.filter((t) => t.status === col.key);
                return (
                    <div key={col.key}>
                        <h3 className="text-sm font-semibold text-text-muted mb-2">
                            {col.label} <span className="text-xs">({group.length})</span>
                        </h3>
                        <div className="flex flex-col gap-2 mb-2">
                            {group.map((task) => (
                                <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
                            ))}
                        </div>
                        <AddTaskInput projectId={projectId} status={col.key} onCreated={onTaskCreated} />
                    </div>
                );
            })}
        </div>
    );
}