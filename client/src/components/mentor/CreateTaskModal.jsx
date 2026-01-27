import { useState } from "react";
import { X } from "lucide-react";
import { toastError, toastSuccess } from "../../utils/toast";
import { createTask } from "../../api/mentor.api";

const CreateTaskModal = ({ programs, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    programId: "",
    internId: "",
    priority: "medium",
    deadline: "",
  });

  const selectedProgram = programs.find((p) => p._id === form.programId);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.programId || !form.internId || !form.deadline) {
      return toastError("Please fill all required fields");
    }

    try {
      setLoading(true);

      const res = await createTask(form);

      toastSuccess("Task created successfully");
      onCreated(res.task);
      onClose();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-5">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">Create Task</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Task title"
          className="w-full border rounded-lg p-3"
          value={form.title}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Task description"
          rows="3"
          className="w-full border rounded-lg p-3"
          value={form.description}
          onChange={handleChange}
        />

        {/* PROGRAM */}
        <select
          name="programId"
          className="w-full border rounded-lg p-3"
          value={form.programId}
          onChange={handleChange}
        >
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* INTERN */}
        {selectedProgram && (
          <select
            name="internId"
            className="w-full border rounded-lg p-3"
            value={form.internId}
            onChange={handleChange}
          >
            <option value="">Select Intern</option>
            {selectedProgram.interns.map((i) => (
              <option key={i.intern._id} value={i.intern._id}>
                {i.intern.name}
              </option>
            ))}
          </select>
        )}

        {/* PRIORITY */}
        <select
          name="priority"
          className="w-full border rounded-lg p-3"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* DEADLINE */}
        <input
          type="date"
          name="deadline"
          className="w-full border rounded-lg p-3"
          value={form.deadline}
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
