"use client";

import { useEffect, useRef } from "react";
import { IconCheck, PriorityIcon, PRIORITY_LABELS } from "./icons";

const ORDER = ["no-priority", "urgent", "high", "medium", "low"];

export function PriorityBadge({ priority }: { priority?: string }) {
    const key = priority && priority !== "no-priority" ? priority : undefined;
    if (!key) return <span className="text-text-muted text-sm">-</span>;
    return (
        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: key === "urgent" ? "#DC2626" : key === "high" ? "#EA580C" : key === "medium" ? "#D97706" : "#6B7280" }}>
            <PriorityIcon priority={key} />
            {PRIORITY_LABELS[key]}
        </span>
    );
}

export function PriorityMenuPanel({
    value,
    onSelect,
    className = "",
    allowAll = false,
}: {
    value?: string;
    onSelect: (priority: string) => void;
    className?: string;
    allowAll?: boolean;
}) {
    return (
        <div className={`bg-surface border border-border rounded-lg shadow-lg py-1 w-44 ${className}`}>
            <div className="px-3 pt-1.5 pb-1 text-xs text-text-muted">Priority</div>
            {allowAll && (
                <button
                    onClick={() => onSelect("all")}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                >
                    All Priorities
                    {value === undefined && <IconCheck size={14} className="text-primary" />}
                </button>
            )}
            {ORDER.map((key) => (
                <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                >
                    <span className="flex items-center gap-2">
                        <PriorityIcon priority={key} />
                        {PRIORITY_LABELS[key]}
                    </span>
                    {value === key && <IconCheck size={14} className="text-primary" />}
                </button>
            ))}
        </div>
    );
}

export default function PriorityMenu({
    value,
    onSelect,
    open,
    onOpenChange,
    trigger,
    align = "left",
    allowAll = false,
}: {
    value?: string;
    onSelect: (priority: string) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: React.ReactNode;
    align?: "left" | "right";
    allowAll?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onOpenChange]);

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={() => onOpenChange(!open)}>{trigger}</div>
            {open && (
                <PriorityMenuPanel
                    value={value}
                    allowAll={allowAll}
                    onSelect={(p) => {
                        onSelect(p);
                        onOpenChange(false);
                    }}
                    className={`absolute z-20 top-full mt-1 ${align === "right" ? "right-0 left-auto max-sm:left-0 max-sm:right-auto" : "left-0"}`}
                />
            )}
        </div>
    );
}
