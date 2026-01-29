import { Menu, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </button>
                <h1 className="text-lg font-semibold lg:hidden">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                    <span className="sr-only">Notifications</span>
                </button>

                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="hidden text-sm font-medium lg:block">Admin User</span>
                </button>
            </div>
        </header>
    );
}
