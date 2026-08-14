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
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted gap-4">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                </div>
                <span className="font-semibold text-text">Pyramid</span>
            </div>
            <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-xl font-semibold mb-1">Let&apos;s get back on track</h1>
                <p className="text-sm text-text-muted mb-6">Enter your email below to login to your account.</p>
                {error && <p className="text-danger text-sm mb-4">{error}</p>}
                <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full bg-black hover:bg-black/90 text-white rounded py-2 text-sm font-medium disabled:opacity-60 mb-3"
                >
                    {loading ? "Signing in..." : "Continue as Guest"}
                </button>
                <button
                    disabled
                    className="w-full border border-border rounded py-2 text-sm font-medium text-text flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                >
                    <svg width="16" height="16" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Login with Google
                </button>
                <p className="text-xs text-text-muted text-center mt-4">
                    By clicking continue, you agree to our{" "}
                    <a href="#" className="underline">Terms of Service</a> and{" "}
                    <a href="#" className="underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}