"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getToken } from "@/lib/api";
import { getStoredTheme, applyTheme } from "@/lib/theme";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
        } else {
            setChecked(true);
        }
    }, [router]);

    useEffect(() => {
        applyTheme(getStoredTheme());
    }, []);

    if (!checked) return null;

    return (
        <div className="flex h-screen relative">
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-30 sm:hidden"
                ></div>
            )}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
                <main className="flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}