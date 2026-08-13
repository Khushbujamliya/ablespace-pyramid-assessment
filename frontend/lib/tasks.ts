import { apiFetch } from "./api";

export type TaskStatus = "backlog" | "todo" | "doing" | "completed" | "onhold";

export type Task = {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: string;
    labels?: string[];
    projectId?: string;
    dueDate?: string;
};

export async function getProjectTasks(projectId: string): Promise<Task[]> {
    const res = await apiFetch(`/tasks?projectId=${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const res = await apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
    const res = await apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
}