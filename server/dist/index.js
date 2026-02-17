import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const port = Number(process.env.PORT ?? 8787);
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
function extractPrompt(body) {
    if (!body || typeof body !== "object") return "";
    const prompt = body.prompt;
    return typeof prompt === "string" ? prompt.trim() : "";
}
function extractOutputText(data) {
    const outputText = (data.output ?? [])
        .flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text" && typeof content.text === "string")
        .map((content) => content.text)
        .join("");
    return outputText || "(No output text returned.)";
}
function extractUpstreamErrorMessage(payload) {
    const maybeError = payload;
    return maybeError?.error?.message || "Upstream API request failed.";
}
app.post("/api/generate", async (req, res) => {
    try {
        const prompt = extractPrompt(req.body);
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Server missing OPENAI_API_KEY." });
        }
        const result = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: prompt,
            }),
            signal: AbortSignal.timeout(30_000),
        });
        if (!result.ok) {
            const upstreamBody = await result.json().catch(() => null);
            const message = extractUpstreamErrorMessage(upstreamBody);
            return res.status(result.status).json({ error: message });
        }
        const data = (await result.json());
        const outputText = extractOutputText(data);
        res.json({ text: outputText });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
});
app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map