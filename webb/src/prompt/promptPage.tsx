import type { KeyboardEvent } from "react";
import { styles } from "./promptStyles";
import { usePrompt } from "./usePrompt";

export function PromptPage() {
    const {
        prompt, setPrompt,
        history, response,
        loading, error,
        canSubmit, submit, clearAll
    } = usePrompt();

    function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            submit();
        }
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>AI Prompt App</h1>
                <button onClick={clearAll} disabled={loading} style={styles.clearButton}>
                    clear
                </button>
            </header>

            <div style={styles.inputRow}>
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Give me a prompt..."
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

            {response && (
                <div>
                    <strong>Resonse</strong>
                    <div> {response} </div>
                </div>
            )}

            <section style={styles.historySection}>
                <h2 style={{ marginTop: 8 }}>History</h2>
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
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
