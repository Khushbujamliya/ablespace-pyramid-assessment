import { apiFetch } from "./api";

export type UserProfile = {
    _id: string;
    fullName: string;
    username: string;
    title?: string;
    email?: string;
    isGuest: boolean;
};

export async function getMe(): Promise<UserProfile> {
    const res = await apiFetch("/users/me");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}

export async function updateMe(updates: { fullName?: string; username?: string; title?: string }): Promise<UserProfile> {
    const res = await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
}