"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectTasks, updateTask, Task, TaskStatus } from "@/lib/tasks";
import ListView from "@/components/ListView";
import BoardView from "@/components/BoardView";
import TaskModal from "@/components/TaskModal";

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<"list" | "board">("list");
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    function refreshTasks() {
        getProjectTasks(id).then(setTasks);
    }

    useEffect(() => {
        getProjectTasks(id).then(setTasks).finally(() => setLoading(false));
    }, [id]);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    async function handleTaskSave(taskId: string, updates: Partial<Task>) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t)));
        await updateTask(taskId, updates);
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading tasks...
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button onClick={() => setView("list")} className={view === "list" ? "font-semibold text-primary" : "text-text-muted"}>
                    List
                </button>
                <button onClick={() => setView("board")} className={view === "board" ? "font-semibold text-primary" : "text-text-muted"}>
                    Board
                </button>
            </div>

            {view === "list" ? (
                <ListView tasks={tasks} onTaskClick={setSelectedTask} projectId={id} onTaskCreated={refreshTasks} />
            ) : (
                <BoardView
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskClick={setSelectedTask}
                    projectId={id}
                    onTaskCreated={refreshTasks}
                />
            )}

            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleTaskSave}
                />
            )}
        </div>
    );
}