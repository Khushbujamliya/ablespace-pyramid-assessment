export default function Logo({ size = 24 }: { size?: number }) {
    return (
        <div
            className="bg-black rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ width: size, height: size }}
        >
            <svg width={size * 0.55} height={size * 0.6} viewBox="0 0 24 26" fill="none">
                <path
                    d="M12 1L22 24H2L12 1Z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    fill="none"
                />
                <path
                    d="M12 1L12 24"
                    stroke="white"
                    strokeWidth="1.8"
                />
                <path
                    d="M12 1L5 24"
                    stroke="white"
                    strokeWidth="1.2"
                    opacity="0.7"
                />
            </svg>
        </div>
    );
}