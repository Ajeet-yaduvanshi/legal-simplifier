const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Helper: clean JSON response ────────────────────────────────────
function cleanJSON(text) {
  return text.replace(/```json|```/g, '').trim();
}

// ── 1. Full Document Analysis ──────────────────────────────────────
async function analyzeDocument(docText) {
  const prompt = `
You are an expert Indian legal advisor. Analyze the following legal document and provide a comprehensive breakdown.

LEGAL DOCUMENT TEXT:
"""
${docText}
"""

Respond ONLY in this exact JSON format (no extra text, no markdown fences):
{
  "docType": "type of document e.g. Rent Agreement / Job Contract / Court Notice / NDA / Service Agreement",
  "simplifiedText": "Write a clear 150-200 word plain language explanation of what this document is about and what it means for the person reading it. Use simple Hindi-English (Hinglish) friendly language.",
  "keyPoints": [
    "Key point 1 — important fact from document",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ],
  "partyNames": ["Name of Party 1", "Name of Party 2"],
  "importantDates": ["Date 1 with context", "Date 2 with context"],
  "riskClauses": [
    {
      "clause": "Exact or near-exact risky clause from the document",
      "explanation": "Why this clause is risky or unfavorable — explain in simple language",
      "severity": "high"
    },
    {
      "clause": "Another risky clause",
      "explanation": "Plain language explanation",
      "severity": "medium"
    }
  ],
  "riskScore": 6,
  "riskSummary": "2-3 sentence overall risk assessment. Is this document fair? What should the person be careful about?"
}

Rules:
- riskScore is 0 (no risk) to 10 (very risky)
- Find ALL risky/unfair clauses — minimum 2, maximum 8
- severity must be exactly: "low", "medium", or "high"
- If party names or dates are not found, use empty arrays []
- Keep all text in English
- Return ONLY valid JSON, nothing else
`;

  const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
  response_format: { type: "json_object" },
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const text = completion.choices[0].message.content;
try {
  return JSON.parse(cleanJSON(text));
} catch (err) {
  console.error("JSON Parse Error:", text);

  return {
    docType: "Legal Document",
    simplifiedText: text,
    keyPoints: [],
    partyNames: [],
    importantDates: [],
    riskClauses: [],
    riskScore: 0,
    riskSummary: "Unable to generate structured analysis."
  };
}
}

// ── 2. Follow-up Q&A Chat ──────────────────────────────────────────
async function askDocumentQuestion(docText, chatHistory, userQuestion) {
  const messages = [
    {
      role: "system",
      content: `You are a helpful Indian legal advisor. The user has uploaded a legal document. Answer their questions about it in simple, clear language (plain English, no legal jargon). Be direct and helpful.

DOCUMENT TEXT (for reference):
"""
${docText.slice(0, 6000)}
"""

Now the user will ask questions about this document. Answer clearly and concisely.`,
    },

    {
      role: "assistant",
      content:
        "I have read your legal document. Please ask me anything about it — I will explain it in simple language.",
    },

    ...chatHistory.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),

    {
      role: "user",
      content: userQuestion,
    },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages,
  });

  return completion.choices[0].message.content;
}

module.exports = { analyzeDocument, askDocumentQuestion };