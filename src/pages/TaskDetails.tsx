import { useNavigate, useParams } from "react-router-dom";
import { useTasks, type TaskStatus } from "@/context/TaskContext";
import { ArrowLeft, Calendar, User, AlertCircle, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskDetails() {
    const { taskId } = useParams();
    const { getTask, updateTaskStatus } = useTasks();
    const navigate = useNavigate();

    const task = taskId ? getTask(taskId) : undefined;

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Task not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" /> Go Back
                </button>
            </div>
        );
    }

    const { status } = { status: task.status };

    // Helper to render actions based on task type and current status
    const renderActions = () => {
        if (task.category === "Approval") {
            if (status === "Approved" || status === "Rejected") return null;
            return (
                <div className="flex gap-4">
                    <button
                        onClick={() => updateTaskStatus(task.id, "Rejected")}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                        <XCircle className="h-5 w-5" />
                        Reject
                    </button>
                    <button
                        onClick={() => updateTaskStatus(task.id, "Approved")}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                    >
                        <CheckCircle className="h-5 w-5" />
                        Approve
                    </button>
                </div>
            )
        } else {
            // Faculty Task
            if (status === "Completed") return null;
            return (
                <div className="flex gap-4">
                    {status === "Pending" && (
                        <button
                            onClick={() => updateTaskStatus(task.id, "In Progress")}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                        >
                            <PlayCircle className="h-5 w-5" />
                            Start Task
                        </button>
                    )}
                    <button
                        onClick={() => updateTaskStatus(task.id, "Completed")}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                    >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Completed
                    </button>
                </div>
            )
        }
    };

    const getStatusColor = (s: TaskStatus) => {
        switch (s) {
            case "Approved":
            case "Completed":
                return "bg-emerald-100 text-emerald-700";
            case "Rejected":
                return "bg-red-100 text-red-700";
            case "In Progress":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-amber-100 text-amber-700";
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(task.status))}>
                                {task.status}
                            </span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                                {task.category}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-muted rounded-lg">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Assignee</p>
                            <p className="font-medium">{task.assignee}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-muted rounded-lg">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Due Date</p>
                            <p className="font-medium">{task.dueDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className={cn("p-2 rounded-lg", task.priority === 'High' ? 'bg-red-100' : task.priority === 'Medium' ? 'bg-amber-100' : 'bg-blue-100')}>
                            <AlertCircle className={cn("h-5 w-5", task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-amber-600' : 'text-blue-600')} />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Priority</p>
                            <p className="font-medium">{task.priority}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="border-t border-border pt-6 flex justify-end">
                    {renderActions()}
                </div>
            </div>
        </div>
    );
}
