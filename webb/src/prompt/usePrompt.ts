import { use, useEffect, useMemo, useState } from "react";
import { generate } from "./promptApi";
import { clearHistory, loadHistory, saveHistory } from "./promptStorage";
import type { HistoryItem } from "./promptTypes";

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export function usePrompt() {
    const [ prompt, setPrompt ] = useState("");
    const [ response, setResponse ] = useState("");
    const [ history, setHistory ] = useState<HistoryItem[]>(() => loadHistory());
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        saveHistory(history);
    }, [ history ]);

    const canSubmit = useMemo(() => !!prompt.trim() && !loading, [prompt, loading]);

    async function submit() {
        const p = prompt.trim();
        if (!p || loading) return;

        setLoading(true);
        setError(null);
        setResponse("");

        try {
            const text = await generate(p);
            setResponse(text);
            const item: HistoryItem = {
                id: uid(),
                prompt: p,
                response: text,
                createdAt: Date.now(),
            };

            setHistory((prev) => [item, ...prev]);
            setPrompt("");
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    function clearAll() {
        setPrompt("");
        setResponse("");
        setError(null);
        setHistory([]);
        clearHistory();
    };

    return {
        prompt,
        setPrompt,
        response,
        history,
        loading,
        error,
        canSubmit,
        submit,
        clearAll,
    };
};

