"use client";

import { useEffect, useState } from "react";
import { ColorMode, getStoredColorMode, applyColorMode, Theme, getStoredTheme, applyTheme } from "@/lib/theme";

const COLOR_OPTIONS: { key: ColorMode; hex: string }[] = [
    { key: "amber", hex: "#D97706" },
    { key: "blue", hex: "#4F46E5" },
    { key: "pink", hex: "#DB2777" },
    { key: "rose", hex: "#E11D48" },
    { key: "emerald", hex: "#059669" },
    { key: "black", hex: "#171717" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [username, setUsername] = useState<string>("");
    const [colorMode, setColorMode] = useState<ColorMode>("blue");
    const [theme, setTheme] = useState<Theme>("light");
    const [menuOpen, setMenuOpen] = useState(false);

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
        setTheme(getStoredTheme());
    }, []);

    function handleColorSelect(mode: ColorMode) {
        setColorMode(mode);
        applyColorMode(mode);
    }

    function toggleTheme() {
        const next: Theme = theme === "light" ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
    }

    return (
        <aside
            className={`fixed sm:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col p-4 transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                }`}
        >
            <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 mb-6 px-1"
            >
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {username ? username[0].toUpperCase() : "G"}
                </div>
                <span className="text-sm font-medium text-text">{username || "Guest"}</span>
            </button>

            {menuOpen && (
                <div className="absolute top-14 left-4 z-10 bg-surface border border-border rounded-lg shadow-lg p-3 w-56">
                    <a href="/profile" className="block text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted mb-1">
                        Profile
                    </a>
                    <button
                        onClick={toggleTheme}
                        className="w-full text-left text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted mb-2"
                    >
                        {theme === "light" ? "🌙 Switch to Dark" : "☀️ Switch to Light"}
                    </button>
                    <div className="text-xs text-text-muted px-2 mb-1">Color Mode</div>
                    <div className="flex gap-2 px-2">
                        {COLOR_OPTIONS.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => handleColorSelect(c.key)}
                                className="w-5 h-5 rounded-full"
                                style={{
                                    backgroundColor: c.hex,
                                    outline: colorMode === c.key ? "2px solid " + c.hex : "none",
                                    outlineOffset: "2px",
                                }}
                                aria-label={c.key}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="text-xs text-text-muted mb-2 px-1 flex items-center gap-1">
                Workspace <span className="text-[10px]">▾</span>
            </div>
            <nav className="flex flex-col gap-1 text-sm text-text-muted mb-6">
                <a href="/projects" onClick={onClose} className="px-3 py-2 rounded hover:bg-surface-muted">Tasks</a>
                <a href="/projects" onClick={onClose} className="px-3 py-2 rounded hover:bg-surface-muted">Projects</a>
            </nav>
        </aside>
    );
}