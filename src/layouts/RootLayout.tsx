import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RootLayout() {
    const location = useLocation();

    const navItems = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tasks", label: "Tasks", icon: CheckSquare },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-4 hidden md:flex md:flex-col">
                <div className="flex items-center gap-2 px-2 py-4 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <CheckSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">SmartTask</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium">JD</span>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-border flex items-center px-6 bg-background/50 backdrop-blur sticky top-0 z-10 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <CheckSquare className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold">SmartTask</span>
                    </div>
                </header>
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
