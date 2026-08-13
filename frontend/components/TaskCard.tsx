import { Task } from "@/lib/tasks";

export default function TaskCard({ task }: { task: Task }) {
    return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing">
            <p className="text-sm font-medium text-text mb-2">{task.title}</p>
            <div className="flex flex-wrap gap-1">
                {task.priority && task.priority !== "No Priority" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {task.priority}
                    </span>
                )}
                {task.labels?.map((label) => (
                    <span key={label} className="text-xs px-2 py-0.5 rounded bg-surface-muted text-text-muted">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}