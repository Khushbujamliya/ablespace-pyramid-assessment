export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-14 border-b border-border bg-surface flex items-center gap-3 px-4 sm:px-6">
            <button
                onClick={onMenuClick}
                className="sm:hidden text-text-muted w-8 h-8 flex items-center justify-center rounded hover:bg-surface-muted"
                aria-label="Toggle menu"
            >
                ☰
            </button>
            <span className="text-sm text-text-muted">Workspace</span>
        </header>
    );
}