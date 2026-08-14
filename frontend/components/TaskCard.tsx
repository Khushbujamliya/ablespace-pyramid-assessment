import { Task } from "@/lib/tasks";

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export default function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
    const formattedDate = formatDate(task.dueDate);

    return (
        <div
            onClick={onClick}
            className="bg-surface border border-border rounded-lg p-3 shadow-sm cursor-pointer hover:border-primary/40"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-text">{task.title}</p>
                {formattedDate && (
                    <span className="text-xs px-2 py-0.5 rounded bg-danger/10 text-danger whitespace-nowrap">
                        {formattedDate}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-1">
                {task.priority && task.priority !== "no-priority" && (
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