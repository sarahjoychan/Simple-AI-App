import type { HistoryItem } from "./promptTypes";

const KEY = "ai_basic_history_v1";

function isHistoryItem(value: unknown): value is HistoryItem {
    if (!value || typeof value !== "object") return false;

    const item = value as Partial<HistoryItem>;
    return (
        typeof item.id === "string" &&
        typeof item.prompt === "string" &&
        typeof item.response === "string" &&
        typeof item.createdAt === "number"
    );
}

export function loadHistory(): HistoryItem[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(isHistoryItem);
    } catch {
        return [];
    }
}

export function saveHistory(items: HistoryItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearHistory() {
    localStorage.removeItem(KEY);
}
