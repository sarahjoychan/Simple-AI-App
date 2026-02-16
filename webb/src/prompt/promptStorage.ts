import type { HistoryItem } from "./promptTypes";

const KEY = "ai_basic_history_v1";

export function loadHistory(): HistoryItem[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    } catch {
        return [];
    }
};

export function saveHistory(items: HistoryItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
};

export function clearHistory() {
    localStorage.removeItem(KEY);
};