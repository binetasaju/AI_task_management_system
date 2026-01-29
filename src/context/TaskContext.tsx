import { createContext, useContext, useState, type ReactNode } from "react";

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Approved" | "Rejected";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: "Approval" | "Faculty";
    description?: string;
}

interface TaskContextType {
    tasks: Task[];
    updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
    getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
    // Approval Tasks
    {
        id: "1",
        title: "Review Mid-term Syllabus",
        assignee: "Dr. Sarah Wilson",
        dueDate: "Feb 02, 2026",
        priority: "High",
        status: "Pending",
        category: "Approval",
        description: "Review the submitted syllabus for the upcoming mid-term examinations for the Computer Science department.",
    },
    {
        id: "2",
        title: "Submit Research Proposal",
        assignee: "Prof. James Carter",
        dueDate: "Feb 05, 2026",
        priority: "Medium",
        status: "Pending",
        category: "Approval",
        description: "Initial submission of the research proposal regarding AI ethics in modern education.",
    },
    {
        id: "3",
        title: "Update Dept. Website",
        assignee: "Tech Team",
        dueDate: "Jan 30, 2026",
        priority: "Low",
        status: "Pending",
        category: "Approval",
        description: "Routine updates to the faculty directory and news section of the department website.",
    },
    // Faculty Tasks
    {
        id: "4",
        title: "Lecture Series Prep",
        assignee: "Me",
        dueDate: "Feb 12, 2026",
        priority: "Medium",
        status: "In Progress",
        category: "Faculty",
        description: "Prepare materials for the upcoming guest lecture series on AI in Education.",
    },
    {
        id: "5",
        title: "Grade 2nd Year Papers",
        assignee: "Me",
        dueDate: "Feb 01, 2026",
        priority: "High",
        status: "Pending",
        category: "Faculty",
        description: "Complete grading for CS201 mid-term examinations.",
    },
];

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, status: newStatus } : task
            )
        );
    };

    const getTask = (id: string) => tasks.find((t) => t.id === id);

    return (
        <TaskContext.Provider value={{ tasks, updateTaskStatus, getTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
}
