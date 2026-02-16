export async function generate(prompt: string): Promise<string> {
    const result = await fetch("http://localhost:8787/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });

    const data = await result.json().catch(() => ({}));
    if (!result.ok) throw new Error(data?.error || "Request failed");
    return data.text as string;
};