"use client";

import { IconList, IconBoard } from "./icons";

export type ViewMode = "list" | "board";

export type FieldsState = {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
};

export const DEFAULT_FIELDS: FieldsState = {
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
};

const FIELD_LABELS: { key: keyof FieldsState; label: string }[] = [
    { key: "priority", label: "Priority" },
    { key: "members", label: "Members" },
    { key: "dueDate", label: "Due Date" },
    { key: "labels", label: "Labels" },
    { key: "status", label: "Status" },
    { key: "reporter", label: "Reporter" },
];

export default function FieldsMenu({
    view,
    onViewChange,
    fields,
    onFieldsChange,
    className = "",
}: {
    view: ViewMode;
    onViewChange: (v: ViewMode) => void;
    fields: FieldsState;
    onFieldsChange: (f: FieldsState) => void;
    className?: string;
}) {
    return (
        <div className={`bg-surface border border-border rounded-lg shadow-lg p-2 w-56 ${className}`}>
            <div className="flex bg-surface-muted rounded-lg p-1 mb-2 gap-1">
                <button
                    onClick={() => onViewChange("list")}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium ${view === "list" ? "bg-surface text-text shadow" : "text-text-muted"}`}
                >
                    <IconList size={13} /> List
                </button>
                <button
                    onClick={() => onViewChange("board")}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium ${view === "board" ? "bg-surface text-text shadow" : "text-text-muted"}`}
                >
                    <IconBoard size={13} /> Board
                </button>
            </div>
            {FIELD_LABELS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 text-sm text-text px-2 py-1.5 cursor-pointer rounded hover:bg-surface-muted">
                    <input
                        type="checkbox"
                        checked={fields[key]}
                        onChange={() => onFieldsChange({ ...fields, [key]: !fields[key] })}
                        className="accent-black"
                    />
                    {label}
                </label>
            ))}
        </div>
    );
}
