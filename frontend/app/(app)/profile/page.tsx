"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe, UserProfile } from "@/lib/users";
import { ColorMode, getStoredColorMode, applyColorMode, Theme, getStoredTheme, applyTheme } from "@/lib/theme";
import Avatar from "@/components/Avatar";
import { IconArrowLeft, IconSearch, IconUser, IconSun, IconCheck, IconPalette, IconPencil } from "@/components/icons";

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
    const [title, setTitle] = useState("");
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
                setTitle(p.title ?? "");
            })
            .finally(() => setLoading(false));
        setTheme(getStoredTheme());
        setColorMode(getStoredColorMode());
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            const updated = await updateMe({ fullName, username, title });
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

    const navItem = (key: "profile" | "theme" | "color", label: string, icon: React.ReactNode) => (
        <button
            onClick={() => setSection(key)}
            className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-sm ${section === key ? "bg-surface-muted text-text font-medium" : "text-text-muted hover:bg-surface-muted"}`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-56 flex-shrink-0">
                <a href="/dashboard" className="flex items-center gap-2 text-sm text-text mb-6 hover:text-text-muted w-fit">
                    <IconArrowLeft size={16} />
                    Back to app
                </a>

                <div className="relative mb-4">
                    <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        placeholder="Search"
                        className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none"
                    />
                </div>

                <nav className="flex flex-col gap-1">
                    {navItem("profile", "Profile", <IconUser size={15} />)}
                    {navItem("theme", "Theme", <IconSun size={15} />)}
                    {navItem("color", "Color", <IconPalette size={15} />)}
                </nav>
            </div>

            <div className="flex-1 max-w-xl">
                {section === "profile" && (
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <Avatar name={fullName || "Guest"} size={56} />
                            <h1 className="text-2xl font-semibold text-text">Profile</h1>
                        </div>

                        <div className="bg-surface border border-border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                <span className="text-sm text-text">Profile picture</span>
                                <Avatar name={fullName || "Guest"} size={44} />
                            </div>

                            {profile.email && (
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                    <span className="text-sm text-text">Email</span>
                                    <span className="flex items-center gap-2 text-sm text-text-muted">
                                        {profile.email}
                                        <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-muted text-text-muted">
                                            <IconPencil size={13} />
                                        </button>
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-6">
                                <span className="text-sm text-text flex-shrink-0">Full name</span>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-surface-muted rounded-lg px-3 py-2 text-sm text-right focus:outline-none w-48"
                                />
                            </div>

                            <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-6">
                                <div className="flex-shrink-0">
                                    <div className="text-sm text-text">Title</div>
                                    <div className="text-xs text-text-muted">Your job title or role</div>
                                </div>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-surface-muted rounded-lg px-3 py-2 text-sm text-right focus:outline-none w-48"
                                />
                            </div>

                            <div className="flex items-center justify-between px-5 py-4 gap-6">
                                <div className="flex-shrink-0">
                                    <div className="text-sm text-text">Username</div>
                                    <div className="text-xs text-text-muted">One word, like a nickname or first name</div>
                                </div>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-surface-muted rounded-lg px-3 py-2 text-sm text-right focus:outline-none w-48"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="self-start bg-black hover:bg-black/90 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <div>
                            <h3 className="text-base font-semibold text-text mb-2">Workspace access</h3>
                            <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
                                <span className="text-sm text-text-muted">Remove yourself from the workspace</span>
                                <button
                                    onClick={handleLeaveWorkspace}
                                    className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-1.5 hover:bg-danger/20"
                                >
                                    Leave Workspace
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {section === "theme" && (
                    <div>
                        <h1 className="text-2xl font-semibold text-text mb-6">Theme</h1>
                        <div className="bg-surface border border-border rounded-lg overflow-hidden">
                            {(["light", "dark"] as Theme[]).map((t, i) => (
                                <button
                                    key={t}
                                    onClick={() => handleThemeSelect(t)}
                                    className={`w-full flex items-center justify-between px-5 py-3 text-sm text-text hover:bg-surface-muted ${i > 0 ? "border-t border-border" : ""}`}
                                >
                                    <span className="flex items-center gap-2 capitalize">
                                        {t === "light" ? <IconSun size={15} className="text-text-muted" /> : <IconSun size={15} className="text-text-muted" />}
                                        {t}
                                    </span>
                                    {theme === t && <IconCheck size={15} className="text-text" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {section === "color" && (
                    <div>
                        <h1 className="text-2xl font-semibold text-text mb-6">Color</h1>
                        <div className="bg-surface border border-border rounded-lg overflow-hidden">
                            {COLOR_OPTIONS.map((c, i) => (
                                <button
                                    key={c.key}
                                    onClick={() => handleColorSelect(c.key)}
                                    className={`w-full flex items-center justify-between px-5 py-3 text-sm text-text hover:bg-surface-muted ${i > 0 ? "border-t border-border" : ""}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c.hex }}></span>
                                        {c.label}
                                    </span>
                                    {colorMode === c.key && <IconCheck size={15} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}