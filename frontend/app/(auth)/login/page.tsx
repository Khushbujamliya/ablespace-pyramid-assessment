"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (getToken()) router.replace("/dashboard");
    }, []);

    async function handleGuestLogin() {
        setLoading(true);
        setError("");
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/guest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Login failed");
            const data = await res.json();
            localStorage.setItem("access_token", data.access_token);
            router.push("/dashboard");
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-muted">
            <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-xl font-semibold mb-1">Pyramid</h1>
                <p className="text-sm text-text-muted mb-6">Continue as a guest to get started</p>
                {error && <p className="text-danger text-sm mb-4">{error}</p>}
                <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded py-2 text-sm font-medium disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Continue as Guest"}
                </button>
            </div>
        </div>
    );
}