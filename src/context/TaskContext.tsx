import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";



export type TaskStatus = "Pending" | "Approved" | "Rejected";

export interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  dueDate: string;
  category: string;
  status: TaskStatus;
}

interface TaskContextType {
  tasks: Task[];
  addExtractedTasks: (taskLines: string[]) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  editTask: (id: string, updates: Partial<Task>) => void; // ✅ IMPORTANT
}


const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  
  const addExtractedTasks = (taskLines: string[]) => {
    const newTasks: Task[] = taskLines.map((line) => ({
      id: uuidv4(),
      title: line.replace(/^- /, "").trim(),
      priority: "Medium",
      assignee: extractAssignee(line),
      dueDate: "Not Set",
      category: "Approval",
      status: "Pending",
    }));

    setTasks((prev) => [...prev, ...newTasks]);
  };

  
  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  
  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addExtractedTasks,
        updateTaskStatus,
        editTask, // ✅ IMPORTANT
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};



export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
};



function extractAssignee(text: string): string {
  const words = text.split(" ");
  return words[0] || "Faculty";
}

