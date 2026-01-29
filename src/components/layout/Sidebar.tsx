import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Upload,
    FileText,
    CheckSquare,
    ClipboardList,
    Bell,
    Calendar,
    User,
    X,
    LogOut,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Upload Audio", href: "/upload-audio", icon: Upload },
    { name: "Meeting Minutes", href: "/meeting-minutes", icon: FileText },
    { name: "Task Approval", href: "/task-approval", icon: CheckSquare },
    { name: "Faculty Tasks", href: "/faculty-tasks", icon: ClipboardList },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 h-screen flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 shrink-0">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        SmartTask
                    </span>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-slate-800 lg:hidden text-slate-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        onClick={() => {
                            // Add logout logic here
                            console.log("Logging out...");
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
