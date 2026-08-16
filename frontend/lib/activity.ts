import { apiFetch } from "./api";

export type Activity = {
    _id: string;
    taskId: string;
    description: string;
    createdAt: string;
    actor?: { fullName?: string; username?: string; avatar?: string };
};

export async function getTaskActivity(taskId: string): Promise<Activity[]> {
    const res = await apiFetch(`/tasks/${taskId}/activity`);
    if (!res.ok) throw new Error("Failed to fetch activity");
    return res.json();
}
