import { apiFetch } from "./api";

export type Comment = {
    _id: string;
    taskId: string;
    text: string;
    author?: { fullName?: string; username?: string };
    createdAt: string;
};

export async function getComments(taskId: string): Promise<Comment[]> {
    const res = await apiFetch(`/comments/task/${taskId}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
}

export async function createComment(taskId: string, text: string): Promise<Comment> {
    const res = await apiFetch(`/comments`, {
        method: "POST",
        body: JSON.stringify({ taskId, text }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return res.json();
}