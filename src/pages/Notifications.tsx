import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
    {
        id: 1,
        title: "Meeting Minutes Processed",
        message: "The audio for 'Faculty Board Meeting' has been successfully processed.",
        time: "2 hours ago",
        type: "success",
        read: false,
    },
    {
        id: 2,
        title: "New Task Assigned",
        message: "You have been assigned to 'Review Mid-term Syllabus'.",
        time: "5 hours ago",
        type: "info",
        read: true,
    },
    {
        id: 3,
        title: "Deadline Approaching",
        message: "Research Grant Proposal is due in 24 hours.",
        time: "1 day ago",
        type: "warning",
        read: true,
    },
];

export function Notifications() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                            notification.read ? "bg-card border-border" : "bg-blue-50/50 border-blue-100"
                        )}
                    >
                        <div
                            className={cn(
                                "mt-1 rounded-full p-2",
                                notification.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : notification.type === "warning"
                                        ? "bg-amber-100 text-amber-600"
                                        : "bg-blue-100 text-blue-600"
                            )}
                        >
                            {notification.type === "success" && <CheckCircle className="h-4 w-4" />}
                            {notification.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                            {notification.type === "info" && <Info className="h-4 w-4" />}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className={cn("font-medium", !notification.read && "text-blue-900")}>
                                    {notification.title}
                                </p>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>

                        {!notification.read && (
                            <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
