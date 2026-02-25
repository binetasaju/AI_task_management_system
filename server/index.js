import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".mp3", ".wav", ".m4a", ".mp4", ".webm", ".ogg"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: mp3, wav, m4a, mp4, webm, ogg"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

/* =========================
   ROUTES
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

  console.log("Processing file:", req.file.originalname);

  // Run LOCAL Whisper
  exec(
    `whisper "${filePath}" --model base --output_format txt --output_dir "${uploadDir}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error("Whisper Error:", stderr);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

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
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(500).json({
          success: false,
          message: "Transcript file not generated",
        });
      }

      const transcript = fs.readFileSync(transcriptPath, "utf-8");

      // Cleanup files
      fs.unlinkSync(filePath);
      fs.unlinkSync(transcriptPath);

      res.json({
        success: true,
        transcript,
      });
    }
  );
});

app.get("/", (req, res) => {
  res.send("Local Whisper API is running 🚀");
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
});

/* =========================
   START SERVER
========================= */

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});