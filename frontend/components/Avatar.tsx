const GRADIENTS = [
    "linear-gradient(135deg,#818CF8,#C084FC)",
    "linear-gradient(135deg,#F472B6,#FB923C)",
    "linear-gradient(135deg,#34D399,#22D3EE)",
    "linear-gradient(135deg,#FBBF24,#F87171)",
    "linear-gradient(135deg,#60A5FA,#34D399)",
    "linear-gradient(135deg,#A78BFA,#F472B6)",
];

function gradientFor(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return GRADIENTS[hash % GRADIENTS.length];
}

export default function Avatar({
    name,
    src,
    size = 24,
    ring = false,
}: {
    name?: string;
    src?: string;
    size?: number;
    ring?: boolean;
}) {
    const label = name?.trim() || "?";
    const initial = label[0]?.toUpperCase() || "?";
    const style: React.CSSProperties = {
        width: size,
        height: size,
        fontSize: Math.max(9, size * 0.42),
        background: src ? undefined : gradientFor(label),
    };

    return (
        <div
            title={name}
            style={style}
            className={`rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold overflow-hidden ${ring ? "ring-2 ring-surface" : ""}`}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={label} className="w-full h-full object-cover" />
            ) : (
                initial
            )}
        </div>
    );
}

export function AvatarStack({ people, size = 22 }: { people: { name?: string; src?: string }[]; size?: number }) {
    if (people.length === 0) return null;
    return (
        <div className="flex items-center -space-x-2">
            {people.slice(0, 3).map((p, i) => (
                <Avatar key={i} name={p.name} src={p.src} size={size} ring />
            ))}
            {people.length > 3 && (
                <div
                    style={{ width: size, height: size, fontSize: Math.max(9, size * 0.38) }}
                    className="rounded-full flex-shrink-0 flex items-center justify-center bg-surface-muted text-text-muted font-semibold ring-2 ring-surface"
                >
                    +{people.length - 3}
                </div>
            )}
        </div>
    );
}
