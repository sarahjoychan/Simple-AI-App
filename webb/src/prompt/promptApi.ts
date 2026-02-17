type GenerateSuccessResponse = {
    text?: string;
};

type GenerateErrorResponse = {
    error?: string;
};

export async function generate(prompt: string): Promise<string> {
    const result = await fetch("http://localhost:8787/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });

    const data = (await result.json().catch(() => ({}))) as GenerateSuccessResponse & GenerateErrorResponse;
    if (!result.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data.text || "";
}
