import { FileText, Download, Eye, MoreHorizontal, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Minute {
  id: number;
  title: string;
  date: string;
  description: string;
  transcript: string;
  tasks?: string;
}

export function MeetingMinutes() {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [viewingMinute, setViewingMinute] = useState<Minute | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null); // tracks which row's menu is open

  useEffect(() => {
    const storedMinutes = JSON.parse(localStorage.getItem("meetingMinutes") || "[]");
    setMinutes(storedMinutes);
  }, []);

  /* ========== DOWNLOAD TRANSCRIPT ========== */
  const handleDownload = (minute: Minute) => {
    const blob = new Blob([minute.transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${minute.title}-transcript.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ========== DELETE MINUTE ========== */
  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this meeting?");
    if (!confirmed) return;
    const updated = minutes.filter((m) => m.id !== id);
    setMinutes(updated);
    localStorage.setItem("meetingMinutes", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Minutes</h1>
          <p className="text-muted-foreground mt-2">Access and manage generated minutes and transcripts.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Meeting Title</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {minutes.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors relative">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.tasks ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.tasks ? "Processed" : "Pending Tasks"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      {/* VIEW BUTTON */}
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        title="View"
                        onClick={() => setViewingMinute(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* DOWNLOAD BUTTON */}
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        title="Download"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {/* MORE MENU BUTTON */}
                      <div className="relative">
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          onClick={() =>
                            setMenuOpenId(menuOpenId === item.id ? null : item.id)
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* MENU */}
                        {menuOpenId === item.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-md z-50">
                            <button
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewingMinute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl p-6 w-11/12 max-w-2xl relative">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => setViewingMinute(null)}
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-bold mb-4">{viewingMinute.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">Date: {viewingMinute.date}</p>
            <p className="text-sm text-muted-foreground mb-4">{viewingMinute.description}</p>
            <div className="border border-border rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
              {viewingMinute.transcript}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}