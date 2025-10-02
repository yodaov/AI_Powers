import express from "express";
import client from "./openaiClient.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/generatePower", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // free-tier model
      messages: [
        {
          role: "system",
          content: `You are an AI that generates game powers.
First: Write ONE brainstorm sentence describing the power's look and effect.
Then: Output ONLY strict JSON with keys: "projectile_js", "trail_js", "impact_js", "deathEffect_js", and "meta".
Each *_js must be a minimal canvas drawing function (no DOM, no eval, no text).`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    });

    const output = completion.choices[0].message.content.trim();
    res.json({ output });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
