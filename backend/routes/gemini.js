const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildPrompt(items) {
  // Items is an array of question objects; each should include _id, question (or questionText), options, correctAnswer (opt)
  // We instruct the model to return strict JSON.
  const instructions = `
You are a concise tutor. For each multiple-choice question below:
- Choose the single correct option and match the *exact text* from the options.
- Provide a 1-3 sentence explanation.
- Return ONLY valid JSON with this exact structure:

{
  "results": [
    { "id": "<question id>", "correctOption": "<option text or null>", "explanation": "<explanation text>" }
  ]
}

Do NOT output any commentary before/after the JSON.
`;

  const body = items
    .map((q) => {
      const qText = q.question || q.questionText || q.questionText || "";
      const opts = Array.isArray(q.options) ? q.options.join(" | ") : "";
      return `ID: ${q._id}
Q: ${qText}
Options: ${opts}
(If available, authoritative correct answer: ${q.correctAnswer ?? "N/A"})
`;
    })
    .join("\n");

  return `${instructions}\n\n${body}`.trim();
}

router.post("/explain-batch", async (req, res) => {
  try {
    const { questions = [], answers = {} } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "questions[] required" });
    }

    const CHUNK = 8; // tune if needed
    const chunks = chunk(questions, CHUNK);
    const map = new Map();

    for (let c = 0; c < chunks.length; c++) {
      const part = chunks[c];

      // Attach the user's selected answer for each item into the prompt text to help the model
      const itemsWithUser = part.map((q) => ({
        ...q,
        userAnswer: answers[q._id] ?? null,
      }));

      const prompt = buildPrompt(itemsWithUser);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });

      // Get model text safely
      let text = "";
      try {
        text = result?.response?.text ? result.response.text() : "";
      } catch (e) {
        // defensive
        text = "";
      }

      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        parsed = null;
      }

      const safeResults = Array.isArray(parsed?.results)
        ? parsed.results
        : part.map((q) => ({
            id: q._id,
            correctOption: null,
            explanation: "Explanation temporarily unavailable."
          }));

      for (const r of safeResults) {
        // normalize
        map.set(r.id, {
          aiCorrectOption: r.correctOption ?? null,
          explanation: r.explanation ?? "Explanation unavailable."
        });
      }
    }

    // Build final explanations object keyed by question _id
    const explanations = {};
    for (const q of questions) {
      const entry = map.get(q._id) || { aiCorrectOption: null, explanation: "Explanation unavailable." };
      // Optionally include whether model matches authoritative correctAnswer:
      const authoritative = q.correctAnswer ?? null;
      const matchesAuthoritative = authoritative && entry.aiCorrectOption ? entry.aiCorrectOption === authoritative : null;

      explanations[q._id] = {
        aiCorrectOption: entry.aiCorrectOption,
        explanation: entry.explanation,
        authoritativeCorrect: authoritative,
        matchesAuthoritative
      };
    }

    return res.json({ explanations });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Failed to fetch explanations" });
  }
});

module.exports = router;
