import { apiFetch } from "./api";

export type Project = {
    _id: string;
    name: string;
    priority?: string;
    dueDate?: string;
    lead?: { fullName?: string; username?: string };
};

export async function getProjects(): Promise<Project[]> {
    const res = await apiFetch("/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
}

export async function getProject(id: string): Promise<Project> {
    const res = await apiFetch(`/projects/${id}`);
    if (!res.ok) throw new Error("Failed to fetch project");
    return res.json();
}

export async function createProject(name: string): Promise<Project> {
    const res = await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await apiFetch(`/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
}

export async function deleteProject(id: string): Promise<void> {
    const res = await apiFetch(`/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");
}