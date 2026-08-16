"use client";

import { useEffect, useState } from "react";
import { ColorMode, getStoredColorMode, applyColorMode, Theme, getStoredTheme, applyTheme } from "@/lib/theme";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

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
    const [email, setEmail] = useState<string>("");
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const user = JSON.parse(stored);
                setUsername(user.fullName || user.username || "Guest");
                setEmail(user.email || "");
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

    const dashboardActive = pathname === "/dashboard";
    const tasksActive = pathname.startsWith("/tasks");
    const projectsActive = pathname.startsWith("/projects");
    const activeClass = "px-3 py-2 rounded transition-colors flex items-center gap-2 bg-primary/15 text-primary font-medium";
    const inactiveClass = "px-3 py-2 rounded transition-colors flex items-center gap-2 text-text-muted hover:bg-surface-muted hover:text-primary";

    return (
        <aside className={"fixed sm:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col p-4 transform transition-transform duration-200 " + (open ? "translate-x-0" : "-translate-x-full sm:translate-x-0")}>
            <div className="flex items-center gap-2 mb-6 px-1">
                <Logo size={24} />
                <span className="font-semibold text-text text-sm">Pyramid</span>
            </div>

            <button
                onClick={() => setMenuOpen(function (prev) { return !prev; })}
                className="flex items-center gap-2 mb-6 px-1"
            >
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {username ? username[0].toUpperCase() : "G"}
                </div>
                <span className="text-sm font-medium text-text">{username || "Guest"}</span>
            </button>

            {menuOpen ? (
                <div className="absolute top-14 left-4 z-10 bg-surface border border-border rounded-lg shadow-lg w-64 overflow-hidden">
                    <div className="flex flex-col items-center text-center px-4 pt-6 pb-4 border-b border-border">
                        <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-semibold flex items-center justify-center mb-3">
                            {username ? username[0].toUpperCase() : "G"}
                        </div>
                        <p className="text-base font-semibold text-text">{username || "Guest"}</p>
                        {email ? <p className="text-sm text-text-muted">{email}</p> : null}
                    </div>

                    <div className="p-2">
                        <button
                            onClick={() => setSubmenu(submenu === "theme" ? null : "theme")}
                            className="w-full flex items-center justify-between text-sm text-text px-2 py-2 rounded hover:bg-surface-muted"
                        >
                            <span>Change Theme</span>
                            <span className="text-xs">{submenu === "theme" ? "down" : "right"}</span>
                        </button>
                        {submenu === "theme" ? (
                            <div className="pl-4 py-1">
                                {["light", "dark"].map(function (t) {
                                    return (
                                        <button
                                            key={t}
                                            onClick={() => handleThemeSelect(t as Theme)}
                                            className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                                        >
                                            <span className="capitalize">{t}</span>
                                            {theme === t ? <span className="text-primary text-xs">on</span> : null}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        <button
                            onClick={() => setSubmenu(submenu === "color" ? null : "color")}
                            className="w-full flex items-center justify-between text-sm text-text px-2 py-2 rounded hover:bg-surface-muted"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded" style={{ backgroundColor: COLOR_OPTIONS.find(function (c) { return c.key === colorMode; })?.hex }}></span>
                                <span>Color Mode</span>
                            </span>
                            <span className="text-xs">{submenu === "color" ? "down" : "right"}</span>
                        </button>
                        {submenu === "color" ? (
                            <div className="pl-4 py-1">
                                {COLOR_OPTIONS.map(function (c) {
                                    return (
                                        <button
                                            key={c.key}
                                            onClick={() => handleColorSelect(c.key)}
                                            className="w-full flex items-center justify-between text-sm text-text px-2 py-1.5 rounded hover:bg-surface-muted"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded" style={{ backgroundColor: c.hex }}></span>
                                                <span>{c.label}</span>
                                            </span>
                                            {colorMode === c.key ? <span className="text-primary text-xs">on</span> : null}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        <a href="/profile" onClick={closeMenu} className="w-full flex items-center gap-2 text-sm text-text px-2 py-2 rounded hover:bg-surface-muted">Settings</a>
                    </div>
                </div>
            ) : null}

            <div className="text-xs text-text-muted mb-2 px-1 flex items-center gap-1">
                <span>Workspace</span>
            </div>
            <nav className="flex flex-col gap-1 text-sm mb-6">
                <a href="/dashboard" onClick={onClose} className={dashboardActive ? activeClass : inactiveClass}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                    </svg>
                    Dashboard
                </a>
                <a href="/tasks" onClick={onClose} className={tasksActive ? activeClass : inactiveClass}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    Tasks
                </a>
                <a href="/projects" onClick={onClose} className={projectsActive ? activeClass : inactiveClass}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                    Projects
                </a>
            </nav>
        </aside>
    );
}
