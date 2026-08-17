"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getTask, updateTask, updateTaskRaw, getSubtasks, createSubtask, Task, TaskStatus, TaskUser } from "@/lib/tasks";
import { getComments, createComment, Comment } from "@/lib/comments";
import { getTaskActivity, Activity } from "@/lib/activity";
import { getAllUsers, UserProfile } from "@/lib/users";
import { STATUS_COLUMNS, STATUS_COLORS } from "@/lib/taskStatus";
import Avatar, { AvatarStack } from "@/components/Avatar";
import PriorityMenu, { PriorityBadge } from "@/components/PriorityMenu";
import DateRangeField from "@/components/DateRangePicker";
import {
    IconEye, IconLock, IconShare, IconMore, IconPanelLeft,
    IconTag, IconPlus, IconLink, IconChevronDown, IconCheck, IconUsers,
    IconPaperclip, IconSend, IconSettings, PriorityIcon,
} from "@/components/icons";

const LABEL_OPTIONS = ["Research", "Design", "Development", "Testing", "Deployment"];

function StatusMenu({ status, onSelect }: { status: TaskStatus; onSelect: (s: TaskStatus) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);
    const current = STATUS_COLUMNS.find((c) => c.key === status);
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-sm text-text hover:bg-surface-muted rounded px-1.5 py-1 -ml-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                {current?.label}
                <IconChevronDown size={12} className="text-text-muted" />
            </button>
            {open && (
                <div className="absolute z-20 top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 w-40">
                    {STATUS_COLUMNS.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => { onSelect(c.key); setOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[c.key] }} />
                                {c.label}
                            </span>
                            {status === c.key && <IconCheck size={13} className="text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function MembersMenu({ members, allUsers, onToggle }: { members: TaskUser[]; allUsers: UserProfile[]; onToggle: (userId: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);
    const memberIds = new Set(members.map((m) => m._id));
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 hover:bg-surface-muted rounded px-1.5 py-1 -ml-1.5">
                {members.length > 0 ? (
                    <AvatarStack people={members.map((m) => ({ name: m.fullName || m.username, src: m.avatar }))} size={22} />
                ) : (
                    <span className="text-sm text-text-muted flex items-center gap-1.5">
                        <IconUsers size={13} /> Add members
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute z-20 top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 w-56 max-h-64 overflow-y-auto">
                    {allUsers.map((u) => (
                        <button
                            key={u._id}
                            onClick={() => onToggle(u._id)}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                        >
                            <span className="flex items-center gap-2">
                                <Avatar name={u.fullName || u.username} src={u.avatar} size={20} />
                                {u.fullName || u.username}
                            </span>
                            {memberIds.has(u._id) && <IconCheck size={13} className="text-primary" />}
                        </button>
                    ))}
                    {allUsers.length === 0 && <p className="text-sm text-text-muted px-3 py-2">No users found.</p>}
                </div>
            )}
        </div>
    );
}

function LabelsMenu({ labels, onToggle }: { labels: string[]; onToggle: (label: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} className="text-sm text-text-muted hover:text-text flex items-center gap-1.5">
                <IconPlus size={12} /> Add
            </button>
            {open && (
                <div className="absolute z-20 top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 w-44">
                    {LABEL_OPTIONS.map((l) => (
                        <button
                            key={l}
                            onClick={() => onToggle(l)}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text hover:bg-surface-muted"
                        >
                            {l}
                            {labels.includes(l) && <IconCheck size={13} className="text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskDetailPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showDetails, setShowDetails] = useState(true);

    const [subtasks, setSubtasks] = useState<Task[]>([]);
    const [newSubtask, setNewSubtask] = useState("");

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    const [activity, setActivity] = useState<Activity[]>([]);
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

    const [newResource, setNewResource] = useState("");
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);

    function refreshActivity() {
        getTaskActivity(taskId).then(setActivity).catch(() => { });
    }

    useEffect(() => {
        getTask(taskId)
            .then((t) => {
                setTask(t);
                setTitle(t.title);
                setDescription(t.description ?? "");
            })
            .finally(() => setLoading(false));
        getSubtasks(taskId).then(setSubtasks);
        getComments(taskId).then(setComments);
        getAllUsers().then(setAllUsers).catch(() => { });
        refreshActivity();
    }, [taskId]);

    async function handleFieldSave(updates: Partial<Task>) {
        if (!task) return;
        const updated = { ...task, ...updates };
        setTask(updated);
        await updateTask(task._id, updates);
        refreshActivity();
    }

    async function handleMembersToggle(userId: string) {
        if (!task) return;
        const current = task.members || [];
        const exists = current.some((m) => m._id === userId);
        const nextIds = exists ? current.filter((m) => m._id !== userId).map((m) => m._id) : [...current.map((m) => m._id), userId];
        const user = allUsers.find((u) => u._id === userId);
        const nextMembers = exists
            ? current.filter((m) => m._id !== userId)
            : [...current, user ? { _id: user._id, fullName: user.fullName, username: user.username, avatar: user.avatar } : { _id: userId }];
        setTask({ ...task, members: nextMembers });
        await updateTaskRaw(task._id, { members: nextIds });
    }

    async function handleLabelToggle(label: string) {
        if (!task) return;
        const current = task.labels || [];
        const next = current.includes(label) ? current.filter((l) => l !== label) : [...current, label];
        await handleFieldSave({ labels: next });
    }

    async function handleAddResource() {
        if (!newResource.trim() || !task) return;
        const next = [...(task.resources || []), newResource.trim()];
        setNewResource("");
        await handleFieldSave({ resources: next });
    }

    async function handleDateChange(range: { start?: string; end?: string }) {
        if (!task) return;
        setTask({ ...task, startDate: range.start, endDate: range.end });
        await updateTaskRaw(task._id, { startDate: range.start || undefined, endDate: range.end || undefined });
    }

    async function handleAddSubtask() {
        if (!newSubtask.trim() || !task) return;
        await createSubtask(newSubtask.trim(), task._id, task.projectId);
        setNewSubtask("");
        getSubtasks(taskId).then(setSubtasks);
    }

    async function handlePostComment() {
        if (!newComment.trim()) return;
        await createComment(taskId, newComment.trim());
        setNewComment("");
        getComments(taskId).then(setComments);
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading task...
            </div>
        );
    }

    if (!task) return <div className="text-text-muted">Task not found.</div>;

    const assignee = task.members?.[0] || task.reporter;

    return (
        <div>
            <div className="flex items-center justify-end mb-5">
                <div className="flex items-center gap-1 text-text-muted">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted" title="Locked">
                        <IconLock size={15} />
                    </button>
                    <span className="flex items-center gap-1 text-xs px-2 py-1">
                        <IconEye size={15} /> 1
                    </span>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted" title="Share">
                        <IconShare size={15} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted">
                        <IconMore size={15} />
                    </button>
                    <button
                        onClick={() => setShowDetails((v) => !v)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted"
                        title={showDetails ? "Hide details" : "Show details"}
                    >
                        <IconPanelLeft size={15} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="flex-1 min-w-0 max-w-2xl">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => title !== task.title && handleFieldSave({ title })}
                        className="w-full text-2xl sm:text-[28px] font-semibold text-text mb-2 focus:outline-none"
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => description !== task.description && handleFieldSave({ description })}
                        placeholder="Add a description..."
                        rows={2}
                        className="w-full text-sm text-text-muted mb-5 focus:outline-none resize-none"
                    />

                    <div className="mb-5">
                        <div className="text-xs text-text-muted mb-2">Properties</div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {assignee && (
                                <span className="inline-flex items-center gap-1.5 bg-surface-muted rounded-full pl-1 pr-3 py-1 text-sm text-text">
                                    <Avatar name={assignee.fullName || assignee.username} src={assignee.avatar} size={20} />
                                    {assignee.title || "Member"}
                                </span>
                            )}
                            <DateRangeField
                                single
                                tone="danger"
                                start={task.dueDate}
                                onChange={(r) => handleFieldSave({ dueDate: r.start })}
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="text-xs text-text-muted mb-2">Labels</div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {task.labels?.map((label) => (
                                <span key={label} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-surface-muted text-text-muted">
                                    <IconTag size={11} />
                                    {label}
                                </span>
                            ))}
                            <LabelsMenu labels={task.labels || []} onToggle={handleLabelToggle} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="text-xs text-text-muted mb-2">Resources</div>
                        <div className="flex flex-col gap-1.5 mb-2">
                            {task.resources?.map((r, i) => (
                                <a key={i} href={r} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline truncate">
                                    <IconLink size={13} className="flex-shrink-0" />
                                    {r}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                            <IconPaperclip size={14} />
                            <input
                                value={newResource}
                                onChange={(e) => setNewResource(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddResource()}
                                placeholder="Add document or link..."
                                className="flex-1 bg-transparent focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-text">Subtasks</div>
                            {subtasks.length > 0 && (
                                <AvatarStack
                                    people={subtasks.filter((s) => s.reporter).map((s) => ({ name: s.reporter?.fullName || s.reporter?.username, src: s.reporter?.avatar }))}
                                    size={22}
                                />
                            )}
                        </div>
                        {subtasks.length > 0 && (
                            <div className="border border-border rounded-lg overflow-x-auto mb-2">
                                <table className="w-full text-sm min-w-160">
                                    <thead>
                                        <tr className="bg-surface-muted text-text-muted text-left">
                                            <th className="px-3 py-2 font-medium whitespace-nowrap">Task</th>
                                            <th className="px-3 py-2 font-medium whitespace-nowrap">Priority</th>
                                            <th className="px-3 py-2 font-medium whitespace-nowrap">Members</th>
                                            <th className="px-3 py-2 font-medium whitespace-nowrap">Due Date</th>
                                            <th className="px-3 py-2 font-medium w-16 whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subtasks.map((st) => (
                                            <tr key={st._id} className="border-t border-border">
                                                <td className="px-3 py-2 text-text whitespace-nowrap">{st.title}</td>
                                                <td className="px-3 py-2"><PriorityBadge priority={st.priority} /></td>
                                                <td className="px-3 py-2">
                                                    {st.members && st.members.length > 0 ? (
                                                        <AvatarStack people={st.members.map((m) => ({ name: m.fullName || m.username, src: m.avatar }))} size={20} />
                                                    ) : <span className="text-text-muted">-</span>}
                                                </td>
                                                <td className="px-3 py-2 text-text-muted whitespace-nowrap">
                                                    {st.dueDate ? new Date(st.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                                </td>
                                                <td className="px-3 py-2 text-text-muted whitespace-nowrap"><IconMore size={14} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                                placeholder="Add subtask..."
                                className="flex-1 border border-border rounded px-3 py-1.5 text-sm focus:outline-none"
                            />
                            <button onClick={handleAddSubtask} className="text-sm bg-black hover:bg-black/90 text-white rounded px-3 py-1.5 flex items-center gap-1.5">
                                <IconPlus size={13} /> Add
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-text mb-3">Comments</div>
                        <div className="flex flex-col gap-4 mb-4">
                            {comments.map((c) => (
                                <div key={c._id} className="flex gap-2.5">
                                    <Avatar name={c.author?.fullName || c.author?.username || "User"} size={28} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-text text-sm">{c.author?.fullName || c.author?.username || "User"}</span>
                                            <span className="text-xs text-text-muted">{timeAgo(c.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-text-muted mt-0.5">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className="text-sm text-text-muted">No comments yet.</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                                placeholder="Add a comment..."
                                className="flex-1 text-sm focus:outline-none"
                            />
                            <IconPaperclip size={15} className="text-text-muted" />
                            <button onClick={handlePostComment} className="text-primary">
                                <IconSend size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {showDetails && (
                    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-text flex items-center gap-1.5">
                                    <IconChevronDown size={13} /> Details
                                </span>
                                <div className="flex items-center gap-1 text-text-muted">
                                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted"><IconPlus size={13} /></button>
                                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-muted"><IconSettings size={13} /></button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0">Status</span>
                                    <StatusMenu status={task.status} onSelect={(s) => handleFieldSave({ status: s })} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0">Priority</span>
                                    <PriorityMenu
                                        value={task.priority}
                                        open={showPriorityMenu}
                                        onOpenChange={setShowPriorityMenu}
                                        onSelect={(p) => handleFieldSave({ priority: p })}
                                        align="right"
                                        trigger={
                                            <button className="flex items-center gap-1.5 text-sm text-text hover:bg-surface-muted rounded px-1.5 py-1 -mr-1.5">
                                                <PriorityIcon priority={task.priority} />
                                                {task.priority && task.priority !== "no-priority" ? task.priority : "None"}
                                                <IconChevronDown size={12} className="text-text-muted" />
                                            </button>
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0">Members</span>
                                    <MembersMenu members={task.members || []} allUsers={allUsers} onToggle={handleMembersToggle} />
                                </div>

                                <div className="flex items-start justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0 pt-1">Dates</span>
                                    <DateRangeField start={task.startDate} end={task.endDate} onChange={handleDateChange} />
                                </div>

                                <div className="flex items-start justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0 pt-1">Labels</span>
                                    <div className="flex flex-wrap justify-end gap-1 flex-1">
                                        {task.labels && task.labels.length > 0 ? task.labels.map((l) => (
                                            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-surface-muted text-text-muted">{l}</span>
                                        )) : <LabelsMenu labels={task.labels || []} onToggle={handleLabelToggle} />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0">Teams</span>
                                    <span className="text-sm text-text">{task.teams && task.teams.length > 0 ? task.teams.join(", ") : "-"}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted w-20 flex-shrink-0">Reporter</span>
                                    {task.reporter ? (
                                        <span className="flex items-center gap-1.5 text-sm text-text">
                                            <Avatar name={task.reporter.fullName || task.reporter.username} src={task.reporter.avatar} size={20} />
                                            {task.reporter.fullName || task.reporter.username}
                                        </span>
                                    ) : <span className="text-text-muted text-sm">-</span>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-text mb-3 flex items-center gap-1.5">
                                <IconChevronDown size={13} /> Updates
                            </div>
                            <div className="flex flex-col gap-3">
                                {activity.map((a) => (
                                    <div key={a._id} className="flex gap-2.5 text-sm">
                                        <Avatar name={a.actor?.fullName || a.actor?.username || "User"} src={a.actor?.avatar} size={22} />
                                        <div className="min-w-0">
                                            <span className="text-text">
                                                <span className="font-medium">{a.actor?.fullName || a.actor?.username || "You"}</span>{" "}
                                                <span className="text-text-muted">{a.description}</span>
                                            </span>
                                            <div className="text-xs text-text-muted">{timeAgo(a.createdAt)}</div>
                                        </div>
                                    </div>
                                ))}
                                {activity.length === 0 && <p className="text-sm text-text-muted">No updates yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
