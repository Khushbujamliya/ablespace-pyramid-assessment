"use client";

import { useEffect, useState } from "react";
import { ColorMode, getStoredColorMode, applyColorMode } from "@/lib/theme";

const COLOR_OPTIONS: { key: ColorMode; hex: string }[] = [
    { key: "amber", hex: "#D97706" },
    { key: "blue", hex: "#4F46E5" },
    { key: "pink", hex: "#DB2777" },
    { key: "rose", hex: "#E11D48" },
    { key: "emerald", hex: "#059669" },
    { key: "black", hex: "#171717" },
];

export default function Sidebar() {
    const [username, setUsername] = useState<string>("");
    const [colorMode, setColorMode] = useState<ColorMode>("blue");

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
        setColorMode(getStoredColorMode());
    }, []);

    function handleColorSelect(mode: ColorMode) {
        setColorMode(mode);
        applyColorMode(mode);
    }

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col p-4">
            <div className="flex items-center gap-2 mb-6 px-1">
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {username ? username[0].toUpperCase() : "G"}
                </div>
                <span className="text-sm font-medium text-text">{username || "Guest"}</span>
            </div>

            <div className="text-xs text-text-muted uppercase tracking-wide mb-2 px-1">Workspace</div>
            <nav className="flex flex-col gap-1 text-sm text-text-muted mb-6">
                <a href="/dashboard" className="px-3 py-2 rounded hover:bg-surface-muted">Dashboard</a>
                <a href="/projects" className="px-3 py-2 rounded hover:bg-surface-muted">Projects</a>
                <a href="/profile" className="px-3 py-2 rounded hover:bg-surface-muted">Profile</a>
            </nav>

            <div className="mt-auto">
                <div className="text-xs text-text-muted uppercase tracking-wide mb-2 px-1">Color</div>
                <div className="flex gap-2 px-1">
                    {COLOR_OPTIONS.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => handleColorSelect(c.key)}
                            className="w-5 h-5 rounded-full border-2"
                            style={{
                                backgroundColor: c.hex,
                                borderColor: colorMode === c.key ? c.hex : "transparent",
                                outline: colorMode === c.key ? "2px solid " + c.hex : "none",
                                outlineOffset: "2px",
                            }}
                            aria-label={c.key}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}