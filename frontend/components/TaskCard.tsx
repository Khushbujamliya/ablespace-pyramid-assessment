import { Task } from "@/lib/tasks";

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
    showPriority = true,
    showDueDate = true,
    showLabels = true,
}: {
    task: Task;
    onClick?: () => void;
    showPriority?: boolean;
    showDueDate?: boolean;
    showLabels?: boolean;
}) {
    const formattedDate = formatDate(task.dueDate);
    const assigneeName = task.reporter?.fullName || task.reporter?.username;

    return (
        <div
            onClick={onClick}
            style={{ borderLeftColor: priorityBorderColor(task.priority), borderLeftWidth: "3px" }}
            className="bg-surface border border-border rounded-lg p-3 shadow cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
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
                {showDueDate && formattedDate && (
                    <span className="text-xs px-2 py-0.5 rounded bg-danger/10 text-danger whitespace-nowrap">
                        {formattedDate}
                    </span>
                )}
            </div>
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