import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { promptPageCss, styles } from "./promptStyles";
import type { HistoryItem } from "./promptTypes";
import { usePrompt } from "./usePrompt";

const RESPONSE_PREVIEW_LENGTH = 180;

export function PromptPage() {
    const {
        prompt, setPrompt,
        history, response,
        loading, error,
        canSubmit, submit, clearAll
    } = usePrompt();
    const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<string>>(new Set());
    const promptInputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const input = promptInputRef.current;
        if (!input) return;
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
    }, [prompt]);

    function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    }

    function toggleHistoryResponse(id: string) {
        setExpandedHistoryIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);  
            return next;
        });
    }

    function getResponsePreview(text: string) {
        if (text.length <= RESPONSE_PREVIEW_LENGTH) return text;
        return `${text.slice(0, RESPONSE_PREVIEW_LENGTH)}...`;
    }

    function renderHistoryEntry(entry: HistoryItem) {
        const isExpanded = expandedHistoryIds.has(entry.id);
        const shouldShowHint = entry.response.length > RESPONSE_PREVIEW_LENGTH;

        return (
            <div key={entry.id} style={styles.historyCard}>
                <div style={styles.historyTime}>{new Date(entry.createdAt).toLocaleString()}</div>
                <div style={styles.historyPromptWrap}>
                    <strong>Prompt:</strong>
                    <div style={styles.preWrap}>{entry.prompt}</div>
                </div>
                <div style={styles.historyResponseWrap}>
                    <strong>Response:</strong>
                    <button
                        type="button"
                        style={styles.responseToggle}
                        onClick={() => toggleHistoryResponse(entry.id)}
                    >
                        <div style={styles.preWrap}>
                            {isExpanded ? entry.response : getResponsePreview(entry.response)}
                        </div>
                        {shouldShowHint && (
                            <div style={styles.responseHint}>
                                {isExpanded ? "Click to collapse" : "Click to expand"}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <style>{promptPageCss}</style>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>AI Prompt App</h1>
            </header>

            <div style={styles.inputRow}>
                <textarea
                    ref={promptInputRef}
                    className="prompt-input"
                    rows={1}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Give me a prompt... (Enter to submit, Shift+Enter for new line)"
                    disabled={loading}
                    style={styles.input}
                    onKeyDown={onInputKeyDown}
                />
                <button onClick={submit} disabled={!canSubmit} style={styles.button}>
                    {loading ? "Loading..." : "Submit"}
                </button>
            </div>

            {error && (
                <div style={styles.errorBox}>
                    <strong> Error: </strong>
                    {error}
                </div>
            )}

            <section style={styles.latestResponseSection}>
                <h2 style={styles.latestResponseTitle}>Latest Response</h2>
                <div style={styles.latestResponseBody}>
                    {loading ? "Generating response..." : response || "Submit a prompt to get a response."}
                </div>
            </section>

            <section style={styles.historySection}>
                <div style={styles.historyHeader}>
                    <h2 style={{ margin: 0 }}>History</h2>
                    <button onClick={clearAll} disabled={loading || history.length === 0} style={styles.clearButton}>
                        Clear
                    </button>
                </div>
                {history.length === 0 ? (
                    <p style={styles.emptyState}>You have no history yet.</p>
                ) : (
                    <div style={styles.historyList}>
                        {history.map(renderHistoryEntry)}
                    </div>
                )}
            </section>
        </div>
    );
}
