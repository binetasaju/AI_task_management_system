import {
  UploadCloud,
  FileAudio,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export function UploadMeetingAudio() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [transcript, setTranscript] = useState<string | null>(null);
  const [tasks, setTasks] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateFile = (file: File) => {
    const allowedExtensions = [".mp3", ".wav", ".m4a", ".mp4", ".webm", ".ogg"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setError("Invalid file type. Allowed: MP3, WAV, M4A, MP4, WEBM, OGG.");
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("File size exceeds 20MB limit.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) setFile(selectedFile);
    }
  };

  const handleClear = () => {
    setFile(null);
    setTitle("");
    setDate("");
    setDescription("");
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsProcessing(false);
    setUploadSuccess(false);
    setTranscript(null);
    setTasks(null);
    setShowTranscript(false);
  };

  // Upload audio & generate transcript
  const handleUpload = async () => {
    if (!file || !title || !date) {
      setError("Please fill in all required fields and upload a file.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadSuccess(false);
    setShowTranscript(false);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const progress = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(progress);
          if (progress === 100) {
            setIsUploading(false);
            setIsProcessing(true);
          }
        },
      });

      if (response.data.success) {
        const transcriptText = response.data.transcript;
        setTranscript(transcriptText);
        setIsProcessing(false);
        setUploadSuccess(true);
        setShowTranscript(true);

        // Save transcript as meeting minute in localStorage
        const storedMinutes = JSON.parse(localStorage.getItem("meetingMinutes") || "[]");
        storedMinutes.unshift({
          id: Date.now(),
          title,
          date,
          description,
          transcript: transcriptText,
          tasks: null,
        });
        localStorage.setItem("meetingMinutes", JSON.stringify(storedMinutes));
      } else throw new Error(response.data.message || "Upload failed");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || err.message || "Failed to upload file.");
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // Extract tasks
  const handleExtractTasks = async () => {
    if (!transcript) return;
    setError(null);
    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:5000/api/extract-tasks", { transcript });
      if (response.data.success) {
        setTasks(response.data.tasks);

        // Update tasks in localStorage for this transcript
        const storedMinutes = JSON.parse(localStorage.getItem("meetingMinutes") || "[]");
        storedMinutes[0].tasks = response.data.tasks; // latest transcript
        localStorage.setItem("meetingMinutes", JSON.stringify(storedMinutes));
      } else throw new Error(response.data.message || "Task extraction failed");
    } catch (err: any) {
      console.error("Task extraction error:", err);
      setError(err.response?.data?.message || err.message || "Failed to extract tasks.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Upload Meeting Audio</h1>
        <p className="text-muted-foreground mt-2">Upload audio files to generate transcripts and actionable tasks.</p>
      </div>

      <div className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        <Input placeholder="Meeting Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUploading || isProcessing || uploadSuccess} />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isUploading || isProcessing || uploadSuccess} />
        <Textarea placeholder="Description (Optional)" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={isUploading || isProcessing || uploadSuccess} />

        {/* Dropzone */}
        <div
          className={cn("flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg", dragActive ? "border-primary bg-primary/5" : "border-muted")}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <UploadCloud className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm">Click or drag audio file here</p>
              <input type="file" className="hidden" accept=".mp3,.wav,.m4a,.mp4,.webm,.ogg" onChange={handleFileChange} />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <FileAudio className="w-6 h-6 text-blue-600" />
              <span className="text-sm">{file.name}</span>
              {!isUploading && <button onClick={() => setFile(null)}><X className="w-4 h-4" /></button>}
            </div>
          )}
        </div>

        {error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" />{error}</div>}

        {/* Buttons */}
        <div className="flex gap-4">
          <button onClick={handleClear} className="px-4 py-2 border rounded-lg">Clear</button>
          <button
            onClick={handleUpload}
            disabled={!file || !title || !date || isUploading || isProcessing}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
          >
            {(isUploading || isProcessing) ? <><Loader2 className="w-4 h-4 animate-spin" />{isUploading ? "Uploading..." : "Processing..."}</> : "Upload & Process"}
          </button>
          {transcript && !tasks && (
            <button onClick={handleExtractTasks} disabled={isProcessing} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</> : "Extract Tasks"}
            </button>
          )}
        </div>

        {/* Transcript Section */}
        {showTranscript && transcript && (
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Generated Transcript</h3>
              <button onClick={handleCopyTranscript} className="flex items-center gap-1 text-sm">
                {copied ? <><Check className="w-4 h-4 text-green-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
            <div className="whitespace-pre-line text-sm text-muted-foreground max-h-96 overflow-y-auto">{transcript}</div>
            {tasks && (
              <div className="mt-4">
                <h4 className="font-semibold">Extracted Tasks:</h4>
                <pre className="whitespace-pre-line text-sm text-muted-foreground">{tasks}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}