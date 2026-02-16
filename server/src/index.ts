import "dotenv/config";


const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

type GenerateBody = { prompt?: string };

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body as GenerateBody;

    if (!prompt || !prompt.trim()) {
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
        input: prompt.trim(),
      }),
    });

    if (!result.ok) {
      const text = await result.text();
      return res.status(result.status).json({ error: text });
    }

    const data: any = await result.json();

    const outputText =
      (data.output ?? [])
        .flatMap((o: any) => o.content ?? [])
        .filter((c: any) => c.type === "output_text")
        .map((c: any) => c.text)
        .join("") || "(No output text returned.)";

    res.json({ text: outputText });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log(`Server: http://localhost:${process.env.PORT || 8787}`);
});