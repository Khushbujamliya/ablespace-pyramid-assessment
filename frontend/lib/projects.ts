import { apiFetch } from "./api";

export type Project = {
    _id: string;
    name: string;
    priority?: string;
};

export async function getProjects(): Promise<Project[]> {
    const res = await apiFetch("/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
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