"use client";

import { useEffect, useState } from "react";
import { ColorMode, getStoredColorMode, applyColorMode, Theme, getStoredTheme, applyTheme } from "@/lib/theme";
import Logo from "./Logo";

const COLOR_OPTIONS: { key: ColorMode; hex: string; label: string }[] = [
    { key: "amber", hex: "#D97706", label: "Amber" },
    { key: "blue", hex: "#4F46E5", label: "Blue" },
    { key: "pink", hex: "#DB2777", label: "Pink" },
    { key: "rose", hex: "#E11D48", label: "Rose" },
    { key: "emerald", hex: "#059669", label: "Emerald" },
    { key: "black", hex: "#171717", label: "Black" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [username, setUsername] = useState<string>("");
    const [colorMode, setColorMode] = useState<ColorMode>("blue");
    const [theme, setTheme] = useState<Theme>("light");
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenu, setSubmenu] = useState<"theme" | "color" | null>(null);

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

    function handleThemeSelect(t: Theme) {
        setTheme(t);
        applyTheme(t);
    }

    function closeMenu() {
        setMenuOpen(false);
        setSubmenu(null);
    }

    return (
        <aside
            className={`fixed sm:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col p-4 transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                }`}
        >
            <div className="flex items-center gap-2 mb-6 px-1">
                <Logo size={24} />
                <span className="font-semibold text-text text-sm">Pyramid</span>
            </div>

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
                <div className="absolute top-14 left-4 z-10 bg-surface border border-border rounded-lg shadow-lg w-56 overflow-hidden">
                    <div className="p-3">
                        <a href="/profile" onClick={closeMenu} className="block text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted mb-1">
                            Settings
                        </a>

                        <button
                            onClick={() => setSubmenu(submenu === "theme" ? null : "theme")}
                            className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                        >
                            <span>Change Theme</span>
                            <span className="text-xs">{submenu === "theme" ? "⌄" : "›"}</span>
                        </button>
                        {submenu === "theme" && (
                            <div className="pl-2 py-1">
                                {(["light", "dark"] as Theme[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleThemeSelect(t)}
                                        className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                                    >
                                        <span className="capitalize">{t}</span>
                                        {theme === t && <span className="text-primary text-xs">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setSubmenu(submenu === "color" ? null : "color")}
                            className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                        >
                            <span>Color Mode</span>
                            <span className="text-xs">{submenu === "color" ? "⌄" : "›"}</span>
                        </button>
                        {submenu === "color" && (
                            <div className="pl-2 py-1">
                                {COLOR_OPTIONS.map((c) => (
                                    <button
                                        key={c.key}
                                        onClick={() => handleColorSelect(c.key)}
                                        className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded" style={{ backgroundColor: c.hex }}></span>
                                            {c.label}
                                        </span>
                                        {colorMode === c.key && <span className="text-primary text-xs">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="text-xs text-text-muted mb-2 px-1 flex items-center gap-1">
                Workspace <span className="text-[10px]">▾</span>
            </div>
            <nav className="flex flex-col gap-1 text-sm text-text-muted mb-6">
                <a href="/dashboard" onClick={onClose} className="px-3 py-2 rounded hover:bg-surface-muted hover:text-primary transition-colors">Dashboard</a>
                <a href="/tasks" onClick={onClose} className="px-3 py-2 rounded hover:bg-surface-muted hover:text-primary transition-colors">Tasks</a>
                <a href="/projects" onClick={onClose} className="px-3 py-2 rounded hover:bg-surface-muted hover:text-primary transition-colors">Projects</a>
            </nav>
        </aside>
    );
}