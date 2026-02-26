import { useState } from "react";
import axios from "axios";
import { useTasks } from "../context/TaskContext";
import { useNavigate } from "react-router-dom";

export function UploadMeetingAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [description, setDescription] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);

  const { addExtractedTasks } = useTasks();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      setTranscript(res.data.transcript);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const handleExtract = async () => {
    if (!transcript) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/extract-tasks",
        { transcript }
      );

      if (res.data.success) {
        const taskLines = res.data.tasks
          .split("\n")
          .filter((line: string) => line.trim() !== "");

        // Show tasks on same page
        setExtractedTasks(taskLines);

        // Store in context for approval page
        addExtractedTasks(taskLines);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Upload Meeting Audio
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload audio to generate transcript and extract tasks.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">

        {/* Meeting Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Meeting Title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>

        <textarea
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <button
          onClick={handleUpload}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md"
        >
          Upload & Transcribe
        </button>

        {/* Transcript */}
        {transcript && (
          <>
            <textarea
              rows={8}
              value={transcript}
              readOnly
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />

            <button
              onClick={handleExtract}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md"
            >
              Extract Tasks
            </button>
          </>
        )}

        {/* Extracted Tasks Display */}
        {extractedTasks.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-lg">
              Extracted Tasks
            </h3>

            {extractedTasks.map((task, index) => (
              <div
                key={index}
                className="p-3 rounded-md border border-border bg-muted"
              >
                {task}
              </div>
            ))}

            <button
              onClick={() => navigate("/task-approval")}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
            >
              Go to Task Approval
            </button>
          </div>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">
            Processing...
          </p>
        )}
      </div>
    </div>
  );
}