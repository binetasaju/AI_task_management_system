import dotenv from "dotenv";
dotenv.config(); // Must be at the very top

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, exec } from "child_process";

// Prisma 7 & Neon Adapter Imports
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// ✅ CRITICAL: Neon requires a WebSocket constructor in Node.js environments
neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 1. Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is not defined in your .env file.");
  process.exit(1);
}

// ✅ 2. Modern Prisma 7 Initialization
// We pass the connection string directly to the adapter
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* =========================
   MULTER CONFIGURATION
========================= */
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

/* =========================
   1️⃣ AUDIO UPLOAD + WHISPER
========================= */
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const filePath = req.file.path;
    console.log("Transcribing:", req.file.originalname);

    exec(`whisper "${filePath}" --model base --output_format txt --output_dir "${uploadPath}"`, async (error) => {
      try {
        if (error) throw new Error(error.message);

        const transcriptPath = filePath.replace(path.extname(filePath), ".txt");
        if (!fs.existsSync(transcriptPath)) throw new Error("Transcript not generated");

        const transcript = fs.readFileSync(transcriptPath, "utf-8");

        const savedTranscript = await prisma.transcript.create({
          data: { content: transcript },
        });

        // Cleanup files
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(transcriptPath)) fs.unlinkSync(transcriptPath);

        res.json({ success: true, transcript, transcriptId: savedTranscript.id });
      } catch (innerErr) {
        console.error("Transcription processing error:", innerErr);
        res.status(500).json({ success: false, message: "Database error during save" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================
   2️⃣ TASK EXTRACTION + SAVE
========================= */
app.post("/api/extract-tasks", async (req, res) => {
  try {
    const { transcript, transcriptId } = req.body;
    if (!transcript || !transcriptId) return res.status(400).json({ success: false, message: "Missing data" });

    const prompt = `Extract only actionable tasks from this transcript. Bullet points only.\n\nTranscript:\n${transcript}`;
    const ollamaProcess = spawn("ollama", ["run", "phi"]);

    let output = "";
    ollamaProcess.stdout.on("data", (data) => (output += data.toString()));

    ollamaProcess.on("close", async (code) => {
      if (code !== 0) return res.status(500).json({ success: false, message: "Ollama error" });

      const taskList = output
        .split("\n")
        .map((t) => t.replace(/^[-•\d.]\s*/, "").trim())
        .filter((t) => t.length > 0);

      const savedTasks = await Promise.all(
        taskList.map((task) =>
          prisma.task.create({
            data: { title: task, transcriptId },
          })
        )
      );

      res.json({ success: true, tasks: savedTasks });
    });

    ollamaProcess.stdin.write(prompt);
    ollamaProcess.stdin.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Task extraction failed" });
  }
});

/* =========================
   3️⃣ TASK MANAGEMENT ROUTES
========================= */
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const updated = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

app.get("/", (req, res) => res.send("AI Task Management System API 🚀"));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});