export type Theme = "light" | "dark";
export type ColorMode = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

export function getStoredTheme(): Theme {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as Theme) || "light";
}

export function applyTheme(theme: Theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
}

export function getStoredColorMode(): ColorMode {
    if (typeof window === "undefined") return "blue";
    return (localStorage.getItem("colorMode") as ColorMode) || "blue";
}

export function applyColorMode(mode: ColorMode) {
    const colors: Record<ColorMode, string> = {
        amber: "#D97706",
        blue: "#4F46E5",
        pink: "#DB2777",
        rose: "#E11D48",
        emerald: "#059669",
        black: "#171717",
    };
    document.documentElement.style.setProperty("--color-primary", colors[mode]);
    document.documentElement.style.setProperty("--color-primary-hover", colors[mode]);
    localStorage.setItem("colorMode", mode);
}