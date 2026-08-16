export default function Topbar({
    onMenuClick,
    onCollapseClick,
    sidebarCollapsed,
}: {
    onMenuClick: () => void;
    onCollapseClick: () => void;
    sidebarCollapsed: boolean;
}) {
    return (
        <header className="h-14 border-b border-border bg-surface flex items-center gap-3 px-4 sm:px-6">
            <button
                onClick={onMenuClick}
                className="sm:hidden text-text-muted w-8 h-8 flex items-center justify-center rounded hover:bg-surface-muted"
                aria-label="Toggle menu"
            >
                ☰
            </button>
            <button
                onClick={onCollapseClick}
                className="hidden sm:flex text-text-muted w-8 h-8 items-center justify-center rounded hover:bg-surface-muted"
                aria-label="Toggle sidebar"
                title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            </button>
            <span className="text-sm text-text-muted">Workspace</span>
        </header>
    );
}