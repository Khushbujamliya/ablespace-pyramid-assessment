"use client";

import { useEffect, useState } from "react";

export default function Sidebar() {
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const user = JSON.parse(stored);
                setUsername(user.fullName || user.username || "Guest");
            } catch {
                setUsername("Guest");
            }
        }
    }, []);

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col p-4">
            <div className="flex items-center gap-2 mb-6 px-1">
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {username ? username[0].toUpperCase() : "G"}
                </div>
                <span className="text-sm font-medium text-text">{username || "Guest"}</span>
            </div>

            <div className="text-xs text-text-muted uppercase tracking-wide mb-2 px-1">Workspace</div>
            <nav className="flex flex-col gap-1 text-sm text-text-muted">
                <a href="/dashboard" className="px-3 py-2 rounded hover:bg-surface-muted">Dashboard</a>
                <a href="/projects" className="px-3 py-2 rounded hover:bg-surface-muted">Projects</a>
            </nav>
        </aside>
    );
}