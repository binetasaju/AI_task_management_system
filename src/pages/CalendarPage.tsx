import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function CalendarPage() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dates = Array.from({ length: 35 }, (_, i) => i + 1 > 31 ? i + 1 - 31 : i + 1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Event
                </button>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="font-semibold">January 2026</h2>
                    <div className="flex items-center gap-2">
                        <button className="rounded-md p-1 hover:bg-muted">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="rounded-md p-1 hover:bg-muted">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b border-border text-center text-xs font-medium text-muted-foreground">
                    {days.map((day) => (
                        <div key={day} className="py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 text-sm">
                    {/* Simple grid for demo purposes. In a real app, this would need proper date logic */}
                    {[...Array(5)].map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/20 p-2" />
                    ))}
                    {[...Array(26)].map((_, i) => (
                        <div
                            key={i}
                            className="group relative min-h-[100px] border-b border-r border-border p-2 hover:bg-muted/30 transition-colors"
                        >
                            <span className="font-medium text-muted-foreground group-hover:text-foreground">
                                {i + 1}
                            </span>
                            {i === 12 && (
                                <div className="mt-1 rounded bg-blue-100 p-1 text-xs text-blue-700">
                                    <span className="font-semibold block">2:00 PM</span>
                                    Dept Meeting
                                </div>
                            )}
                            {i === 24 && (
                                <div className="mt-1 rounded bg-emerald-100 p-1 text-xs text-emerald-700">
                                    <span className="font-semibold block">10:00 AM</span>
                                    Guest Lecture
                                </div>
                            )}
                        </div>
                    ))}
                    {[...Array(4)].map((_, i) => (
                        <div key={`empty-end-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/20 p-2" />
                    ))}

                </div>
            </div>
        </div>
    );
}
