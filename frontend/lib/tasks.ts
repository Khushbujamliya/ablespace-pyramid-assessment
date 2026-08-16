import { apiFetch } from "./api";

export type TaskStatus = "backlog" | "todo" | "doing" | "completed" | "onhold";

export type Task = {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: string;
    labels?: string[];
    teams?: string[];
    projectId?: string;
    dueDate?: string;
    reporter?: { fullName?: string; username?: string };
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
export async function createTask(title: string, status: TaskStatus, projectId: string) {
    const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, status, projectId }),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
}
export async function getTask(taskId: string): Promise<Task> {
    const res = await apiFetch(`/tasks/${taskId}`);
    if (!res.ok) throw new Error("Failed to fetch task");
    return res.json();
}
export async function getAllTasks(): Promise<Task[]> {
    const res = await apiFetch(`/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
}
export async function getSubtasks(taskId: string): Promise<Task[]> {
    const res = await apiFetch(`/tasks/${taskId}/subtasks`);
    if (!res.ok) throw new Error("Failed to fetch subtasks");
    return res.json();
}

export async function createSubtask(title: string, parentTaskId: string, projectId?: string) {
    const res = await apiFetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify({ title, status: "todo", parentTaskId, projectId }),
    });
    if (!res.ok) throw new Error("Failed to create subtask");
    return res.json();
}