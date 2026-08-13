export default function Sidebar() {
    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col p-4">
            <div className="font-semibold text-lg mb-6">Pyramid</div>
            <nav className="flex flex-col gap-1 text-sm text-text-muted">
                <a href="/dashboard" className="px-3 py-2 rounded hover:bg-surface-muted">Dashboard</a>
                {/* project list will go here on Day 5 */}
            </nav>
        </aside>
    );
}