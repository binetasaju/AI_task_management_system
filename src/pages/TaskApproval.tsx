import { CheckCircle, XCircle, Info } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function TaskApproval() {
    const { tasks, updateTaskStatus } = useTasks();
    const navigate = useNavigate();

    const approvalTasks = tasks.filter((t) => t.category === "Approval" && t.status === "Pending");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Task Approval</h1>
                <p className="text-muted-foreground mt-2">
                    Review and approve tasks assigned to faculty members.
                </p>
            </div>

            <div className="grid gap-4">
                {approvalTasks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
                        No pending approvals.
                    </div>
                ) : (
                    approvalTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm gap-4 sm:gap-0"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                            task.priority === "High"
                                                ? "bg-red-100 text-red-700"
                                                : task.priority === "Medium"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-blue-100 text-blue-700"
                                        )}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Assigned to: <span className="font-medium text-foreground">{task.assignee}</span> • Due: {task.dueDate}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors border border-transparent hover:border-border"
                                >
                                    <Info className="h-4 w-4" />
                                    Details
                                </button>
                                <button
                                    onClick={() => updateTaskStatus(task.id, "Rejected")}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => updateTaskStatus(task.id, "Approved")}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
