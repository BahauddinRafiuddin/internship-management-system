import { useState } from "react";
import { X, Star } from "lucide-react";
import { toastError, toastSuccess } from "../../utils/toast";
import { reviewTask } from "../../api/mentor.api";

const ReviewTaskModal = ({ task, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    status: "approved",
    score: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.score === "" || form.score < 0 || form.score > 10) {
      return toastError("Score must be between 0 and 10");
    }

    try {
      setLoading(true);

      const res = await reviewTask(task._id, {
        status: form.status,
        score: Number(form.score),
        feedback: form.feedback,
      });
      console.log("res", res);
      toastSuccess("Task reviewed successfully");

      await refresh();
      onClose();
    } catch (error) {
      console.log(error);
      toastError(error.response?.data?.message || "Failed to review task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4">
      <form className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-4 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Review Task</h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* TASK INFO */}
        {/* <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <p>
            <b>Task:</b> {task.title}
          </p>

          <p className="text-sm text-gray-600">{task.description}</p>

          <p className="text-sm">
            <b>Intern:</b> {task.assignedIntern?.name}
          </p>

          <p className="text-sm">
            <b>Email:</b> {task.assignedIntern?.email}
          </p>

          <p className="text-sm">
            <b>Submission Link: </b> {task.submissionLink}
          </p>
          <p className="text-sm">
            <b>Submission Text: </b> {task.submissionText}
          </p>
          <p className="text-sm">
            <b>Submission File:</b> {task.submissionFile}
          </p>
          <p> </p>
        </div> */}
        {/* TASK INFO */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
          <p>
            <b>Task:</b> {task.title}
          </p>

          <p className="text-gray-600">{task.description}</p>

          <hr />

          <p>
            <b>Intern:</b> {task.assignedIntern?.name}
          </p>

          <p>
            <b>Email:</b> {task.assignedIntern?.email}
          </p>

          <hr />

          {/* SUBMISSION LINK */}
          {task.submissionLink && (
            <p>
              <b>Submission Link:</b>{" "}
              <a
                href={task.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all hover:text-blue-800"
              >
                {task.submissionLink}
              </a>
            </p>
          )}

          {/* SUBMISSION TEXT */}
          {task.submissionText && (
            <div>
              <b>Submission Text:</b>
              <p className="mt-1 bg-white border rounded-lg p-3 text-gray-700">
                {task.submissionText}
              </p>
            </div>
          )}

          {/* SUBMISSION FILE */}
          {task.submissionFile && (
            <p>
              <b>Submission File:</b>{" "}
              <a
                href={task.submissionFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-800"
              >
                View / Download File
              </a>
            </p>
          )}
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Review Decision
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full cursor-pointer"
          >
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>

        {/* SCORE */}
        <div>
          <label className="block text-sm font-medium mb-1">Score (0–10)</label>

          <input
            type="number"
            min="0"
            max="10"
            name="score"
            value={form.score}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Enter score"
          />
        </div>

        {/* FEEDBACK */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Feedback (optional)
          </label>

          <textarea
            rows="3"
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Write feedback..."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={!loading ? handleSubmit : undefined}
            type="button"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewTaskModal;
