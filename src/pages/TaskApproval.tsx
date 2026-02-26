import { CheckCircle, XCircle, Pencil, Save, Plus } from "lucide-react";
import { useTasks } from "../context/TaskContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function TaskApproval() {
  const { tasks, updateTaskStatus, editTask } = useTasks();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedAssignee, setEditedAssignee] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const approvalTasks = tasks.filter(
    (t) => t.status === "Pending"
  );

  /* ================= EDIT HANDLERS ================= */

  const handleEdit = (task: any) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
    setEditedAssignee(task.assignee);
    setEditedDueDate(task.dueDate);
  };

  const handleSave = (taskId: string) => {
    editTask(taskId, {
      title: editedTitle,
      assignee: editedAssignee,
      dueDate: editedDueDate,
    });
    setEditingId(null);
  };

  /* ================= ADD NEW TASK ================= */

  const handleAddTask = () => {
    if (!newTitle.trim()) return;

    editTask("new", {}); // dummy call to satisfy TS if needed

    const newTask = {
      id: crypto.randomUUID(),
      title: newTitle,
      priority: "Medium" as const,
      assignee: newAssignee || "Not Assigned",
      dueDate: newDueDate || "Not Set",
      category: "Approval",
      status: "Pending" as const,
    };

    // Directly update using editTask logic
    editTask(newTask.id, newTask);

    setNewTitle("");
    setNewAssignee("");
    setNewDueDate("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 p-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Task Approval
          </h1>
          <p className="text-muted-foreground mt-2">
            Review, edit or add tasks before approval.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* ADD TASK FORM */}
      {showAddForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <input
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Assign to"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md"
          >
            Save Task
          </button>
        </div>
      )}

      {/* TASK LIST */}
      <div className="grid gap-4">
        {approvalTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
            No pending approvals.
          </div>
        ) : (
          approvalTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm gap-4"
            >
              <div className="space-y-3 w-full">

                {/* TITLE */}
                {editingId === task.id ? (
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  />
                ) : (
                  <h3 className="font-semibold">{task.title}</h3>
                )}

                {/* ASSIGNEE */}
                {editingId === task.id ? (
                  <input
                    value={editedAssignee}
                    onChange={(e) => setEditedAssignee(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm">
                    Assigned to: <strong>{task.assignee}</strong>
                  </p>
                )}

                {/* DUE DATE */}
                {editingId === task.id ? (
                  <input
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Due: {task.dueDate}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3">
                {editingId === task.id ? (
                  <button
                    onClick={() => handleSave(task.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => updateTaskStatus(task.id, "Rejected")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>

                <button
                  onClick={() => updateTaskStatus(task.id, "Approved")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md"
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