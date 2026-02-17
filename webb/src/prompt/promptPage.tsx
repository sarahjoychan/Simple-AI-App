import { useState, type KeyboardEvent } from "react";
import { styles } from "./promptStyles";
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

    function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    }

    function toggleHistoryResponse(id: string) {
        setExpandedHistoryIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function getResponsePreview(text: string) {
        if (text.length <= RESPONSE_PREVIEW_LENGTH) {
            return text;
        }

        return `${text.slice(0, RESPONSE_PREVIEW_LENGTH)}...`;
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>AI Prompt App</h1>
            </header>

            <div style={styles.inputRow}>
                <textarea
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
                    {loading ? "Generating response..." : response || "Submit a prompt to see the latest response."}
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
                        {history.map((entry) => (
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
                                            {expandedHistoryIds.has(entry.id)
                                                ? entry.response
                                                : getResponsePreview(entry.response)}
                                        </div>
                                        {entry.response.length > RESPONSE_PREVIEW_LENGTH && (
                                            <div style={styles.responseHint}>
                                                {expandedHistoryIds.has(entry.id)
                                                    ? "Click to collapse"
                                                    : "Click to expand"}
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
