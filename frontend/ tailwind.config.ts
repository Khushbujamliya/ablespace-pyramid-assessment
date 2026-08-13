import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4F46E5",   // main brand/action color
                    hover: "#4338CA",
                },
                surface: {
                    DEFAULT: "#FFFFFF",   // cards, panels
                    muted: "#F5F5F7",     // page background
                },
                border: "#E5E7EB",
                text: {
                    DEFAULT: "#111827",
                    muted: "#6B7280",
                },
                danger: "#DC2626",
                success: "#16A34A",
            },
            borderRadius: {
                DEFAULT: "8px",
                lg: "12px",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;