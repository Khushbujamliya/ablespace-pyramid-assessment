"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTask, updateTask, getSubtasks, createSubtask, Task, TaskStatus } from "@/lib/tasks";
import { getComments, createComment, Comment } from "@/lib/comments";
import { STATUS_COLUMNS } from "@/lib/taskStatus";
import Link from "next/link";

export default function TaskDetailPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [subtasks, setSubtasks] = useState<Task[]>([]);
    const [newSubtask, setNewSubtask] = useState("");

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

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
    }, [taskId]);

    async function handleFieldSave(updates: Partial<Task>) {
        if (!task) return;
        const updated = { ...task, ...updates };
        setTask(updated);
        await updateTask(task._id, updates);
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

    return (
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => router.back()} className="text-sm text-text-muted">
                        ← Back
                    </button>
                    <span className="text-text-muted text-xs">·</span>
                    <Link href="/dashboard" className="text-sm text-primary hover:underline">
                        Dashboard
                    </Link>
                </div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => title !== task.title && handleFieldSave({ title })}
                    className="w-full text-2xl font-semibold text-text mb-3 focus:outline-none"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => description !== task.description && handleFieldSave({ description })}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full text-sm text-text-muted mb-6 focus:outline-none resize-none"
                />

                {task.labels && task.labels.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-text-muted mb-2">Labels</div>
                        <div className="flex flex-wrap gap-1">
                            {task.labels.map((label) => (
                                <span key={label} className="text-xs px-2 py-0.5 rounded bg-surface-muted text-text-muted">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {task.teams && task.teams.length > 0 && (
                    <div className="mb-6">
                        <div className="text-xs text-text-muted mb-2">Teams</div>
                        <div className="flex flex-wrap gap-1">
                            {task.teams.map((team) => (
                                <span key={team} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                    {team}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <div className="text-sm font-semibold text-text mb-2">Subtasks</div>
                    {subtasks.length > 0 && (
                        <div className="border border-border rounded-lg overflow-hidden mb-2">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-surface-muted text-text-muted text-left">
                                        <th className="px-3 py-2 font-medium">Task</th>
                                        <th className="px-3 py-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subtasks.map((st) => (
                                        <tr key={st._id} className="border-t border-border">
                                            <td className="px-3 py-2 text-text">{st.title}</td>
                                            <td className="px-3 py-2 text-text-muted">
                                                {STATUS_COLUMNS.find((c) => c.key === st.status)?.label}
                                            </td>
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
                        <button
                            onClick={handleAddSubtask}
                            className="text-sm bg-primary text-white rounded px-3 py-1.5"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold text-text mb-2">Comments</div>
                    <div className="flex flex-col gap-3 mb-3">
                        {comments.map((c) => (
                            <div key={c._id} className="text-sm">
                                <span className="font-medium text-text">{c.author?.fullName || "User"}</span>
                                <span className="text-xs text-text-muted ml-2">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                                <p className="text-text-muted mt-0.5">{c.text}</p>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p className="text-sm text-text-muted">No comments yet.</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                            placeholder="Add a comment..."
                            className="flex-1 border border-border rounded px-3 py-1.5 text-sm focus:outline-none"
                        />
                        <button
                            onClick={handlePostComment}
                            className="text-sm bg-primary text-white rounded px-3 py-1.5"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l border-border pt-6 sm:pt-0 sm:pl-6">
                <div className="text-sm font-semibold text-text mb-4">Details</div>

                <div className="flex flex-col gap-4 text-sm">
                    <div>
                        <div className="text-xs text-text-muted mb-1">Status</div>
                        <select
                            value={task.status}
                            onChange={(e) => handleFieldSave({ status: e.target.value as TaskStatus })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        >
                            {STATUS_COLUMNS.map((col) => (
                                <option key={col.key} value={col.key}>{col.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted mb-1">Priority</div>
                        <select
                            value={task.priority || "no-priority"}
                            onChange={(e) => handleFieldSave({ priority: e.target.value })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        >
                            <option value="no-priority">No Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted mb-1">Due Date</div>
                        <input
                            type="date"
                            value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                            onChange={(e) => handleFieldSave({ dueDate: e.target.value })}
                            className="w-full border border-border rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}