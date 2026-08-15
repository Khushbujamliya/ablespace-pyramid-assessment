"use client";

import { useEffect, useState } from "react";
import { getMe, updateMe, UserProfile } from "@/lib/users";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getMe()
            .then((p) => {
                setProfile(p);
                setFullName(p.fullName);
                setUsername(p.username);
            })
            .finally(() => setLoading(false));
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
        <div className="max-w-lg">
            <h1 className="text-xl font-semibold text-text mb-6">Profile</h1>

            <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
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
            </div>
        </div>
    );
}