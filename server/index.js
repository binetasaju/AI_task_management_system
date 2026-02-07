import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from "node-fetch";
import FormData from "form-data";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Configuration
app.use(cors());
app.use(express.json());

// OpenAI Setup (Removed SDK, using fetch)

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
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
    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP3 and WAV are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB limit
    },
});

// Routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        console.log(`Processing file: ${req.file.originalname}`);

        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API Key is missing');
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API Error');
        }

        console.log('Transcription successful');

        // Clean up: delete the file after processing
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            transcript: data.text,
        });

    } catch (error) {
        console.error('Error processing audio:', error);

        // Attempt to cleanup even if error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(500).json({
            success: false,
            message: 'Transcription failed', // Generic message as requested, or error.message for debugging
        });
    }
});

app.get('/', (req, res) => {
    res.send('Smart Task Dashboard API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        // Other errors (including fileFilter errors)
        return res.status(500).json({ success: false, message: err.message });
    }
    next();
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
