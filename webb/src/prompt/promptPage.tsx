import { usePrompt } from "./usePrompt";

export function PromptPage() {
    const {
        prompt, setPrompt,
        response, history,
        loading, error,
        canSubmit, submit, clearAll
    } = usePrompt();

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12}}>
                <h1 style={{ margin: 0}}>AI Prompt App</h1>
                <button onClick={clearAll} disabled={loading} style={{ padding: "8px 12px"}}>
                    clear
                </button>
            </header>

            <div style={{ marginTop: 12, display: "flex", gap: 8}}>
                <input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}

                />
            </div>
        </div>
    )

}