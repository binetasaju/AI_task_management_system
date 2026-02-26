import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, exec } from "child_process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* =========================
   MULTER CONFIGURATION
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

/* =========================
   1️⃣ AUDIO UPLOAD + WHISPER
========================= */

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const filePath = req.file.path;
  const uploadDir = path.dirname(filePath);

  console.log("Transcribing:", req.file.originalname);

  exec(
    `whisper "${filePath}" --model base --output_format txt --output_dir "${uploadDir}"`,
    (error) => {
      if (error) {
        console.error("Whisper Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "Whisper transcription failed",
        });
      }

      const transcriptPath = filePath.replace(
        path.extname(filePath),
        ".txt"
      );

      if (!fs.existsSync(transcriptPath)) {
        return res.status(500).json({
          success: false,
          message: "Transcript file not generated",
        });
      }

      const transcript = fs.readFileSync(transcriptPath, "utf-8");

      res.json({
        success: true,
        transcript,
      });
    }
  );
});

/* =========================
   2️⃣ TASK EXTRACTION (STABLE VERSION)
========================= */

app.post("/api/extract-tasks", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({
      success: false,
      message: "Transcript is required",
    });
  }

  console.log("Extracting tasks using PHI...");

  const prompt = `Extract only actionable tasks from this meeting transcript.
Return short bullet points only.
Do not explain.

Transcript:
${transcript}`;

  const ollamaProcess = spawn("ollama", ["run", "phi"]);

  let output = "";
  let errorOutput = "";

  ollamaProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollamaProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  ollamaProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("PHI Error:", errorOutput);
      return res.status(500).json({
        success: false,
        message: "Task extraction failed",
      });
    }

    res.json({
      success: true,
      tasks: output.trim(),
    });
  });

  // Send prompt safely via stdin
  ollamaProcess.stdin.write(prompt);
  ollamaProcess.stdin.end();
});

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("AI Task Management System API 🚀");
});

/* =========================
   START SERVER
========================= */

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});