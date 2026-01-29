import { ClipboardList, CalendarClock, AlertCircle } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FacultyTasks() {
    const { tasks, updateTaskStatus } = useTasks();
    const navigate = useNavigate();

    const myTasks = tasks.filter((t) => t.category === "Faculty");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your assigned tasks and deadlines.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myTasks.map((task) => (
                    <div
                        key={task.id}
                        className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "p-2 rounded-lg",
                                task.status === "Completed" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                            )}>
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium px-2 py-1 rounded",
                                task.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                            )}>
                                {task.status}
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                            {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4 mt-auto">
                            <div className="flex items-center gap-1">
                                <CalendarClock className="h-4 w-4" />
                                <span>{task.dueDate}</span>
                            </div>
                            <div className={cn("flex items-center gap-1", task.priority === "High" ? "text-red-600" : task.priority === "Medium" ? "text-amber-600" : "text-blue-600")}>
                                <AlertCircle className="h-4 w-4" />
                                <span>Priority: {task.priority}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            {task.status !== "Completed" && (
                                <button
                                    onClick={() => updateTaskStatus(task.id, "Completed")}
                                    className="flex-1 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Mark Complete
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                className="flex-1 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
