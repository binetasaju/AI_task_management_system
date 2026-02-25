import { FileText, Download, Eye, MoreHorizontal } from "lucide-react";
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

  useEffect(() => {
    const storedMinutes = JSON.parse(localStorage.getItem("meetingMinutes") || "[]");
    setMinutes(storedMinutes);
  }, []);

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
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.description}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.tasks ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {item.tasks ? "Processed" : "Pending Tasks"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}