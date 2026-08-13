"use client";

import { useState, useEffect } from "react";
import { getStoredTheme, applyTheme, Theme } from "@/lib/theme";

export default function Topbar() {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        setTheme(getStoredTheme());
    }, []);

    function toggleTheme() {
        const next: Theme = theme === "light" ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
    }

    return (
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6">
            <span className="text-sm text-text-muted">Workspace</span>
            <button
                onClick={toggleTheme}
                className="text-sm px-3 py-1.5 rounded border border-border text-text hover:bg-surface-muted"
            >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
        </header>
    );
}