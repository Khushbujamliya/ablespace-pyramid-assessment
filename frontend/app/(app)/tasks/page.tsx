"use client";

import { useEffect, useState } from "react";
import { getAllTasks, Task, TaskStatus } from "@/lib/tasks";
import BoardView from "@/components/BoardView";
import ListView from "@/components/ListView";
import { getProjects } from "@/lib/projects";
import TaskModal from "@/components/TaskModal";
import FieldsMenu, { DEFAULT_FIELDS, FieldsState, ViewMode } from "@/components/FieldsMenu";
import PriorityMenu from "@/components/PriorityMenu";
import { IconChevronDown, IconColumns, IconPlus, IconSearch, PRIORITY_LABELS } from "@/components/icons";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showFieldsMenu, setShowFieldsMenu] = useState(false);
    const [view, setView] = useState<ViewMode>("list");
    const [fields, setFields] = useState<FieldsState>(DEFAULT_FIELDS);
    const [defaultProjectId, setDefaultProjectId] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const storedView = localStorage.getItem("tasksView") as ViewMode | null;
        if (storedView) setView(storedView);
        const storedFields = localStorage.getItem("tasksFields");
        if (storedFields) {
            try { setFields(JSON.parse(storedFields)); } catch { }
        }
    }, []);

    function handleViewChange(v: ViewMode) {
        setView(v);
        localStorage.setItem("tasksView", v);
    }

    function handleFieldsChange(f: FieldsState) {
        setFields(f);
        localStorage.setItem("tasksFields", JSON.stringify(f));
    }

    function refreshTasks() {
        getAllTasks().then(setTasks);
    }

    useEffect(() => {
        getAllTasks().then(setTasks).finally(() => setLoading(false));
        getProjects().then((projects) => {
            if (projects.length > 0) setDefaultProjectId(projects[0]._id);
        });
    }, []);

    function handleTaskUpdated(taskId: string, status: TaskStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch = !search.trim() || t.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h1 className="text-lg font-semibold">Tasks</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            <IconSearch size={14} />
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="border border-border rounded pl-8 pr-3 py-1.5 text-sm w-32 sm:w-56 focus:outline-none"
                        />
                    </div>

                    <PriorityMenu
                        value={priorityFilter === "all" ? undefined : priorityFilter}
                        allowAll
                        open={showPriorityMenu}
                        onOpenChange={setShowPriorityMenu}
                        onSelect={(p) => setPriorityFilter(p)}
                        trigger={
                            <button className="border border-border rounded px-3 py-1.5 text-sm text-text flex items-center gap-1.5">
                                {priorityFilter === "all" ? "All Priorities" : PRIORITY_LABELS[priorityFilter]}
                                <IconChevronDown size={13} className="text-text-muted" />
                            </button>
                        }
                    />

                    <div className="relative">
                        <button
                            onClick={() => setShowFieldsMenu((prev) => !prev)}
                            className="border border-border rounded px-3 py-1.5 text-sm text-text flex items-center gap-1.5"
                        >
                            <IconColumns size={14} />
                            Fields
                        </button>
                        {showFieldsMenu && (
                            <FieldsMenu
                                view={view}
                                onViewChange={handleViewChange}
                                fields={fields}
                                onFieldsChange={handleFieldsChange}
                                className="absolute right-0 left-auto max-sm:left-0 max-sm:right-auto top-full mt-1 z-10"
                            />
                        )}
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-black hover:bg-black/90 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5"
                    >
                        <IconPlus size={14} />
                        Add Task
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                <span>{filteredTasks.length} tasks</span>
                <span>·</span>
                <span>{filteredTasks.filter((t) => t.status === "completed").length} completed</span>
                <span>·</span>
                <span className="text-danger">
                    {filteredTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length} overdue
                </span>
            </div>

            {view === "list" ? (
                <ListView
                    tasks={filteredTasks}
                    projectId={defaultProjectId}
                    onTaskCreated={refreshTasks}
                    fields={fields}
                />
            ) : (
                <BoardView
                    tasks={filteredTasks}
                    onTaskUpdated={handleTaskUpdated}
                    projectId={defaultProjectId}
                    onTaskCreated={refreshTasks}
                    fields={fields}
                />
            )}

            {showCreateModal && (
                <TaskModal
                    mode="create"
                    defaultStatus="todo"
                    projectId={defaultProjectId}
                    onClose={() => setShowCreateModal(false)}
                    onSaved={refreshTasks}
                />
            )}
        </div>
    );
}