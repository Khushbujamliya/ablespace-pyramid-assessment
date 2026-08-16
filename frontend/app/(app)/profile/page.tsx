"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe, UserProfile } from "@/lib/users";
import { ColorMode, getStoredColorMode, applyColorMode, Theme, getStoredTheme, applyTheme } from "@/lib/theme";

const COLOR_OPTIONS: { key: ColorMode; hex: string; label: string }[] = [
    { key: "amber", hex: "#D97706", label: "Amber" },
    { key: "blue", hex: "#4F46E5", label: "Blue" },
    { key: "pink", hex: "#DB2777", label: "Pink" },
    { key: "rose", hex: "#E11D48", label: "Rose" },
    { key: "emerald", hex: "#059669", label: "Emerald" },
    { key: "black", hex: "#171717", label: "Black" },
];

export default function ProfilePage() {
    const router = useRouter();
    const [section, setSection] = useState<"profile" | "theme" | "color">("profile");

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [theme, setTheme] = useState<Theme>("light");
    const [colorMode, setColorMode] = useState<ColorMode>("blue");

    useEffect(() => {
        getMe()
            .then((p) => {
                setProfile(p);
                setFullName(p.fullName);
                setUsername(p.username);
            })
            .finally(() => setLoading(false));
        setTheme(getStoredTheme());
        setColorMode(getStoredColorMode());
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            const updated = await updateMe({ fullName, username });
            setProfile(updated);
            localStorage.setItem("user", JSON.stringify(updated));
        } finally {
            setSaving(false);
        }
    }

    function handleThemeSelect(t: Theme) {
        setTheme(t);
        applyTheme(t);
    }

    function handleColorSelect(mode: ColorMode) {
        setColorMode(mode);
        applyColorMode(mode);
    }

    function handleLeaveWorkspace() {
        const confirmed = window.confirm("Are you sure you want to leave the workspace? You'll be logged out.");
        if (!confirmed) return;
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.push("/login");
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading profile...
            </div>
        );
    }

    if (!profile) return <div className="text-text-muted">Profile not found.</div>;

    return (
        <div className="flex gap-8">
            <div className="w-48 flex-shrink-0">
                <nav className="flex flex-col gap-1 text-sm">
                    <button
                        onClick={() => setSection("profile")}
                        className={`text-left px-3 py-2 rounded ${section === "profile" ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-muted"}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setSection("theme")}
                        className={`text-left px-3 py-2 rounded ${section === "theme" ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-muted"}`}
                    >
                        Theme
                    </button>
                    <button
                        onClick={() => setSection("color")}
                        className={`text-left px-3 py-2 rounded ${section === "color" ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-muted"}`}
                    >
                        Color
                    </button>
                </nav>
            </div>

            <div className="flex-1 max-w-lg">
                {section === "profile" && (
                    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-text mb-2">Profile</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-primary text-white text-lg font-semibold flex items-center justify-center">
                                {fullName ? fullName[0].toUpperCase() : "G"}
                            </div>
                            <span className="text-xs text-text-muted">Profile picture (initial-based)</span>
                        </div>

                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Full name</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="self-start bg-primary hover:bg-primary-hover text-white text-sm px-4 py-2 rounded disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <div className="border-t border-border pt-4 mt-2 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text">Leave Workspace</p>
                                <p className="text-xs text-text-muted">Remove yourself and log out</p>
                            </div>
                            <button
                                onClick={handleLeaveWorkspace}
                                className="text-sm text-danger border border-danger/30 rounded px-3 py-1.5 hover:bg-danger/10"
                            >
                                Leave Workspace
                            </button>
                        </div>
                    </div>
                )}

                {section === "theme" && (
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Theme</h2>
                        <div className="flex flex-col gap-2">
                            {(["light", "dark"] as Theme[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => handleThemeSelect(t)}
                                    className="flex items-center justify-between text-sm text-text px-3 py-2 rounded border border-border hover:bg-surface-muted"
                                >
                                    <span className="capitalize">{t}</span>
                                    {theme === t && <span className="text-primary">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {section === "color" && (
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Color</h2>
                        <div className="flex flex-col gap-2">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => handleColorSelect(c.key)}
                                    className="flex items-center justify-between text-sm text-text px-3 py-2 rounded border border-border hover:bg-surface-muted"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded" style={{ backgroundColor: c.hex }}></span>
                                        {c.label}
                                    </span>
                                    {colorMode === c.key && <span className="text-primary">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}