import { UploadCloud, FileAudio, X, FileText, AlertCircle, CheckCircle2, Loader2, FileType, Copy, Check } from "lucide-react";
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

    // Upload & Processing State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Transcript State
    const [transcript, setTranscript] = useState<string | null>(null);
    const [showTranscript, setShowTranscript] = useState(false);
    const [copied, setCopied] = useState(false);

    // Error State
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        const validTypes = ["audio/mpeg", "audio/wav", "audio/x-m4a", "audio/mp4"];
        if (!validTypes.includes(file.type) && !file.name.endsWith(".m4a")) {
            setError("Invalid file type. Please upload MP3, WAV, or M4A.");
            return false;
        }
        // Updated limit to 20MB
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
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
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
        setShowTranscript(false);
    };

    const handleUpload = async () => {
        if (!file || !title || !date) {
            setError("Please fill in all required fields and upload a file.");
            return;
        }

        setError(null);
        setIsUploading(true);
        setUploadSuccess(false);
        setShowTranscript(false);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("date", date);
        formData.append("description", description);

        try {
            // Real API Call
            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1;
                    const progress = Math.round((progressEvent.loaded * 100) / total);
                    setUploadProgress(progress);
                    if (progress === 100) {
                        setIsUploading(false);
                        setIsProcessing(true);
                    }
                }
            }).then((response) => {
                if (response.data.success) {
                    setTranscript(response.data.transcript);
                    setIsProcessing(false);
                    setUploadSuccess(true);
                } else {
                    throw new Error(response.data.message || "Upload failed");
                }
            });

        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.response?.data?.message || err.message || "Failed to upload file. Please try again.");
            setIsUploading(false);
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Meeting Audio</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Upload audio files to generate transcripts and actionable tasks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Form Fields */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Meeting Title <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Q1 Marketing Strategy Review"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isUploading || isProcessing || uploadSuccess}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Meeting Date <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        className="w-full justify-start text-left font-normal"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        disabled={isUploading || isProcessing || uploadSuccess}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Description <span className="text-muted-foreground font-normal">(Optional)</span>
                                </label>
                                <Textarea
                                    placeholder="Brief summary or context about the meeting..."
                                    className="resize-none"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isUploading || isProcessing || uploadSuccess}
                                />
                            </div>
                        </div>

                        {/* File Dropzone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Audio File <span className="text-destructive">*</span>
                            </label>
                            <div
                                className={cn(
                                    "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out",
                                    dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 bg-muted/5",
                                    (isUploading || isProcessing || uploadSuccess) ? "opacity-60 pointer-events-none" : "hover:border-primary/50 hover:bg-muted/30 cursor-pointer",
                                    error ? "border-destructive/50 bg-destructive/5" : ""
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => !file && document.getElementById("dropzone-file")?.click()}
                            >
                                {!file ? (
                                    <>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                            <div className={cn("rounded-full p-4 mb-4 transition-transform duration-300", dragActive ? "bg-primary/20 scale-110" : "bg-primary/10")}>
                                                <UploadCloud className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="mb-2 text-sm font-medium text-foreground">
                                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                MP3, WAV, or M4A (MAX. 20MB)
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="audio/*"
                                            disabled={isUploading || isProcessing || uploadSuccess}
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                                        <div className="flex items-center gap-4 w-full max-w-sm bg-background p-4 rounded-lg border shadow-sm relative group">
                                            <div className="rounded-full bg-blue-100 p-3 flex-shrink-0">
                                                <FileAudio className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                            {!isUploading && !isProcessing && !uploadSuccess && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                    className="rounded-full hover:bg-destructive/10 hover:text-destructive p-2 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-destructive mt-2 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button
                            onClick={handleClear}
                            disabled={isUploading || isProcessing}
                            className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                        >
                            {uploadSuccess ? "Upload Another" : "Clear Form"}
                        </button>
                        {!uploadSuccess && (
                            <button
                                onClick={handleUpload}
                                disabled={!file || !title || !date || isUploading || isProcessing}
                                className={cn(
                                    "flex-1 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                )}
                            >
                                {(isUploading || isProcessing) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isUploading ? "Uploading..." : "Processing..."}
                                    </>
                                ) : "Upload & Process"}
                            </button>
                        )}
                    </div>

                    {/* Transcript Display Section */}
                    {showTranscript && transcript && (
                        <div className="bg-card border border-border rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Generated Transcript</h3>
                                </div>
                                <button
                                    onClick={handleCopyTranscript}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background border border-transparent hover:border-border rounded-md transition-all"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-green-600" />
                                            <span className="text-green-600">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-6 max-h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <div className="whitespace-pre-line font-mono text-sm">
                                    {transcript}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Status & Preview */}
                <div className="space-y-6">
                    {/* Status Card */}
                    {(isUploading || isProcessing || uploadSuccess) && (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                {uploadSuccess ? (
                                    <><CheckCircle2 className="w-5 h-5 text-green-500" /> Complete</>
                                ) : (
                                    "Status"
                                )}
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>Upload</span>
                                        <span className={uploadProgress === 100 ? "text-green-600" : ""}>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>

                                {(isProcessing || uploadSuccess) && (
                                    <div className="space-y-2 animate-in fade-in">
                                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                            <span>Processing Audio</span>
                                            <span className={!isProcessing ? "text-green-600" : ""}>{isProcessing ? "Wait..." : "Done"}</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-300 ease-out",
                                                    isProcessing ? "bg-blue-500 w-full animate-pulse" : "bg-green-600 w-full"
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {uploadSuccess && (
                                <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm text-green-600 mb-4 font-medium">
                                        Transcript generated successfully.
                                    </p>
                                    <button
                                        onClick={() => setShowTranscript(true)}
                                        disabled={showTranscript}
                                        className={cn(
                                            "w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium shadow-sm",
                                            showTranscript
                                                ? "bg-muted-foreground/30 cursor-default opacity-50"
                                                : "bg-green-600 hover:bg-green-700"
                                        )}
                                    >
                                        <FileText className="w-4 h-4" />
                                        {showTranscript ? "Transcript Visible" : "View Transcript"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
                        <div className="flex gap-3">
                            <div className="mt-0.5">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900">Note on Privacy</h3>
                                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                    All uploaded audio files are processed securely and automatically deleted after 30 days. ensuring compliance with university data protection policies.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supported Formats */}
                    <div className="bg-gray-50/50 border border-border rounded-lg p-5">
                        <h3 className="text-sm font-semibold mb-3">Supported Formats</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <FileType className="w-4 h-4" />
                                <span>MP3, WAV, M4A, MP4</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <UploadCloud className="w-4 h-4" />
                                <span>Max file size: 20MB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
