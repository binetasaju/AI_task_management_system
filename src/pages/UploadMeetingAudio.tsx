import { UploadCloud, FileAudio, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UploadMeetingAudio() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Upload Meeting Audio</h1>
                <p className="text-muted-foreground mt-2">
                    Upload audio files from meetings to generate minutes and tasks automatically.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors",
                        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                        "hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!file ? (
                        <>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="rounded-full bg-primary/10 p-4 mb-4">
                                    <UploadCloud className="w-8 h-8 text-primary" />
                                </div>
                                <p className="mb-2 text-sm font-medium text-foreground">
                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    MP3, WAV, or M4A (MAX. 50MB)
                                </p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept="audio/*"
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="rounded-full bg-blue-100 p-4">
                                    <FileAudio className="w-8 h-8 text-blue-600" />
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="absolute -top-1 -right-1 rounded-full bg-destructive text-destructive-foreground p-1 hover:bg-destructive/90"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                    )}
                </div>

                {file && (
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-sm">
                            Process Audio
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">Note on Privacy</h3>
                <p className="text-sm text-blue-600 mt-1">
                    All uploaded audio files are processed securely and automatically deleted after 30 days. ensuring compliance with university data protection policies.
                </p>
            </div>
        </div>
    );
}
