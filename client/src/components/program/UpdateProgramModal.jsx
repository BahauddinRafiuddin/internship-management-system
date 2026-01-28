import { useState } from "react";
import { updateProgram } from "../../api/program.api";
import { toastError, toastSuccess } from "../../utils/toast";

const domains = [
  "Backend Development",
  "Frontend Development",
  "Web Development",
  "AI / ML",
  "Data Science",
  "Mobile App Development",
];

const UpdateProgramModal = ({ program, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [durationInweek,setDurationInWeek]=useState(program.durationInWeeks)

  const [form, setForm] = useState({
    title: program.title,
    domain: program.domain,
    description: program.description,
    rules: program.rules,
    startDate: program.startDate?.slice(0, 10),
    endDate: program.endDate?.slice(0, 10),
  });

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = endDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
      return toastError("Duration must be minimum one week");
    }

    return Math.ceil(diffDays / 7);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = {
      ...form,
      [name]: value,
    };
    // Auto calculate duration
    if (
      (name === "startDate" || name === "endDate") &&
      updatedForm.startDate &&
      updatedForm.endDate
    ) {
      if (new Date(updatedForm.endDate) <= new Date(updatedForm.startDate)) {
        return toastError("End date must be after start date");
      }
      const weeks = calculateDuration(
        updatedForm.startDate,
        updatedForm.endDate,
      );

      if (weeks > 0) {
        updatedForm.durationInWeeks = weeks;
      }
      setDurationInWeek(weeks)
    }
    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProgram(program._id, form);

      toastSuccess(res.message);

      refresh();
      onClose();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold">Update Program</h2>

        {/* Title */}
        <input
          name="title"
          placeholder="Program title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        {/* Domain */}
        <select
          name="domain"
          value={form.domain}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        >
          {domains.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Start And End Date */}
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          value={durationInweek}
          readOnly
          className="border p-3 bg-gray-100 cursor-not-allowed rounded"
        />

        {/* Rules */}
        <textarea
          name="rules"
          placeholder="Internship rules"
          value={form.rules}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Program description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProgramModal;
