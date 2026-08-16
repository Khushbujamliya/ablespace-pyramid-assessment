export const STATUS_COLUMNS: { key: import("./tasks").TaskStatus; label: string }[] = [
    { key: "backlog", label: "Backlog" },
    { key: "todo", label: "To Do" },
    { key: "doing", label: "Doing" },
    { key: "completed", label: "Completed" },
    { key: "onhold", label: "On Hold" },
];

export const STATUS_COLORS: Record<string, string> = {
    backlog: "#D97706",
    todo: "#4F46E5",
    doing: "#D97706",
    completed: "#16A34A",
    onhold: "#DC2626",
};