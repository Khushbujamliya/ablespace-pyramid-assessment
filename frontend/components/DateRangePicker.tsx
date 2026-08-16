"use client";

import { useEffect, useRef, useState } from "react";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "./icons";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toISO(y: number, m: number, d: number) {
    return new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
}

function parse(dateStr?: string) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function fmt(dateStr?: string) {
    const d = parse(dateStr);
    if (!d) return null;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Calendar({
    start,
    end,
    onPick,
}: {
    start?: string;
    end?: string;
    onPick: (dateStr: string) => void;
}) {
    const initial = parse(start) || new Date();
    const [year, setYear] = useState(initial.getFullYear());
    const [month, setMonth] = useState(initial.getMonth());

    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { day: number; current: boolean; iso: string }[] = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
        cells.push({ day: prevMonthDays - i, current: false, iso: "" });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, current: true, iso: toISO(year, month, d) });
    }
    while (cells.length % 7 !== 0) {
        cells.push({ day: cells.length - (startWeekday + daysInMonth) + 1, current: false, iso: "" });
    }

    function changeMonth(delta: number) {
        let m = month + delta;
        let y = year;
        if (m < 0) { m = 11; y -= 1; }
        if (m > 11) { m = 0; y += 1; }
        setMonth(m);
        setYear(y);
    }

    const startDate = parse(start);
    const endDate = parse(end);

    return (
        <div className="p-3 w-64">
            <div className="flex items-center justify-between mb-3">
                <button onClick={() => changeMonth(-1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted text-text-muted">
                    <IconChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-text">{MONTHS[month]} {year}</span>
                <button onClick={() => changeMonth(1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted text-text-muted">
                    <IconChevronRight size={16} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((w) => (
                    <div key={w} className="text-xs text-text-muted font-medium py-1">{w}</div>
                ))}
                {cells.map((c, i) => {
                    if (!c.current) {
                        return <div key={i} className="text-xs text-text-muted/40 py-1.5">{c.day > 0 ? c.day : ""}</div>;
                    }
                    const isStart = start === c.iso;
                    const isEnd = end === c.iso;
                    const inRange = startDate && endDate && parse(c.iso)! > startDate && parse(c.iso)! < endDate;
                    return (
                        <button
                            key={i}
                            onClick={() => onPick(c.iso)}
                            className={`text-xs py-1.5 rounded-full mx-auto w-7 h-7 flex items-center justify-center transition-colors
                                ${isStart || isEnd ? "bg-text text-white font-semibold" : inRange ? "bg-primary/10 text-primary" : "text-text hover:bg-surface-muted"}`}
                        >
                            {c.day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function DateRangeField({
    start,
    end,
    onChange,
    single = false,
    tone = "neutral",
}: {
    start?: string;
    end?: string;
    onChange: (range: { start?: string; end?: string }) => void;
    single?: boolean;
    tone?: "neutral" | "danger";
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    function handlePick(iso: string) {
        if (single) {
            onChange({ start: iso, end: undefined });
            setOpen(false);
            return;
        }
        if (!start || (start && end)) {
            onChange({ start: iso, end: undefined });
        } else if (iso < start) {
            onChange({ start: iso, end: start });
        } else {
            onChange({ start, end: iso });
        }
    }

    const pillClass = tone === "danger"
        ? "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-danger/10 text-danger hover:bg-danger/20"
        : "inline-flex items-center gap-1.5 border border-border rounded-full px-2.5 py-1 text-text hover:bg-surface-muted";

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-sm"
            >
                <span className={pillClass}>
                    <IconCalendar size={13} className={tone === "danger" ? "" : "text-text-muted"} />
                    {fmt(start) || (single ? "Due date" : "Start")}
                </span>
                {!single && (
                    <>
                        <span className="text-text-muted">→</span>
                        <span className="inline-flex items-center gap-1.5 border border-border rounded-full px-2.5 py-1 text-text hover:bg-surface-muted">
                            <IconCalendar size={13} className="text-text-muted" />
                            {fmt(end) || "End"}
                        </span>
                    </>
                )}
            </button>
            {open && (
                <div className="absolute z-30 top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg">
                    <Calendar start={start} end={single ? undefined : end} onPick={handlePick} />
                </div>
            )}
        </div>
    );
}
