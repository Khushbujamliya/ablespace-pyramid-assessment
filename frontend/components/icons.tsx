type IconProps = { size?: number; className?: string };

function base(children: React.ReactNode, { size = 16, className }: IconProps = {}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {children}
        </svg>
    );
}

export const IconSearch = (p: IconProps) => base(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, p);
export const IconChevronDown = (p: IconProps) => base(<polyline points="6 9 12 15 18 9" />, p);
export const IconChevronRight = (p: IconProps) => base(<polyline points="9 18 15 12 9 6" />, p);
export const IconChevronLeft = (p: IconProps) => base(<polyline points="15 18 9 12 15 6" />, p);
export const IconCheck = (p: IconProps) => base(<polyline points="20 6 9 17 4 12" />, p);
export const IconMore = (p: IconProps) => base(<><circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" /></>, p);
export const IconPlus = (p: IconProps) => base(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, p);
export const IconX = (p: IconProps) => base(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, p);
export const IconSun = (p: IconProps) => base(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>, p);
export const IconMoon = (p: IconProps) => base(<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />, p);
export const IconSettings = (p: IconProps) => base(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>, p);
export const IconPencil = (p: IconProps) => base(<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></>, p);
export const IconTrash = (p: IconProps) => base(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></>, p);
export const IconPaperclip = (p: IconProps) => base(<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />, p);
export const IconSend = (p: IconProps) => base(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>, p);
export const IconUsers = (p: IconProps) => base(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>, p);
export const IconList = (p: IconProps) => base(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>, p);
export const IconBoard = (p: IconProps) => base(<><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="10" rx="1" /></>, p);
export const IconFilter = (p: IconProps) => base(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />, p);
export const IconColumns = (p: IconProps) => base(<><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" /></>, p);
export const IconTag = (p: IconProps) => base(<><path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.17L3 3v6.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.59-4.59a2 2 0 000-2.83z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></>, p);
export const IconCalendar = (p: IconProps) => base(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, p);
export const IconEye = (p: IconProps) => base(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, p);
export const IconShare = (p: IconProps) => base(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>, p);
export const IconLock = (p: IconProps) => base(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, p);
export const IconPanelLeft = (p: IconProps) => base(<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /></>, p);
export const IconArrowLeft = (p: IconProps) => base(<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>, p);
export const IconLink = (p: IconProps) => base(<><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></>, p);
export const IconUser = (p: IconProps) => base(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>, p);
export const IconGrip = (p: IconProps) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" className={p.className}>
        {[9, 15].flatMap((cx) => [6, 12, 18].map((cy) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="currentColor" />
        )))}
    </svg>
);
export const IconPalette = (p: IconProps) => base(<><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.2-.3-.4-.6-.4-1 0-.8.7-1.4 1.5-1.4H16c3.3 0 6-2.7 6-6 0-4.5-4.5-9-10-9z" /></>, p);
export const IconSpinner = (p: IconProps) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" className={`animate-spin ${p.className ?? ""}`}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

export function PriorityIcon({ priority, size = 14 }: { priority?: string; size?: number }) {
    const color = PRIORITY_COLORS[priority || "no-priority"] || PRIORITY_COLORS["no-priority"];
    const active = PRIORITY_LEVEL[priority || "no-priority"] ?? 0;
    const heights = [5, 8, 11];
    return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
            {heights.map((h, i) => (
                <rect key={i} x={i * 4.5} y={13 - h} width="3" height={h} rx="0.8" fill={i < active ? color : "#D1D5DB"} />
            ))}
        </svg>
    );
}

export const PRIORITY_COLORS: Record<string, string> = {
    "no-priority": "#9CA3AF",
    low: "#6B7280",
    medium: "#D97706",
    high: "#EA580C",
    urgent: "#DC2626",
};

export const PRIORITY_LEVEL: Record<string, number> = {
    "no-priority": 0,
    low: 1,
    medium: 2,
    high: 3,
    urgent: 3,
};

export const PRIORITY_LABELS: Record<string, string> = {
    "no-priority": "No Priority",
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
};
