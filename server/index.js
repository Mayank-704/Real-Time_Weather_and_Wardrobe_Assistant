import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleChat } from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────

/** Health check */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * POST /api/chat
 * Body: { message: string, preferences?: object, history?: array }
 * Returns the AI-generated wardrobe recommendation.
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, preferences, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A non-empty `message` string is required." });
    }

    console.log(`\n🗨️  User: "${message}"`);

    const reply = await handleChat({ message, preferences, history });

    console.log(`✅ Response sent (${reply.length} chars)`);
    res.json({ reply });
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running → http://localhost:${PORT}`);
  console.log(`   Health check   → http://localhost:${PORT}/api/health\n`);
});
