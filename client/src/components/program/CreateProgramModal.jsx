import { useEffect, useState } from "react";
import { createProgram } from "../../api/program.api";
import { getAllMentors } from "../../api/admin.api";
import { toastError, toastSuccess } from "../../utils/toast";

const domains = [
  "Backend Development",
  "Frontend Development",
  "Web Development",
  "AI / ML",
  "Data Science",
  "Mobile App Development",
];

const CreateProgram = ({ onClose, refresh }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    domain: "",
    description: "",
    mentorId: "",
    durationInWeeks: "",
    startDate: "",
    endDate: "",
  });

  // Load mentors
  useEffect(() => {
    const loadMentors = async () => {
      try {
        const res = await getAllMentors();
        setMentors(res.mentors);
      } catch {
        toastError("Failed to load mentors");
      }
    };

    loadMentors();
  }, []);

  // Calculate durationInweek
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = endDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return Math.ceil(diffDays / 7);
  };

  // Handle change
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
      const weeks = calculateDuration(
        updatedForm.startDate,
        updatedForm.endDate,
      );

      if (weeks > 0) {
        updatedForm.durationInWeeks = weeks;
      }
    }

    setForm(updatedForm);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (
      !form.title ||
      !form.domain ||
      !form.mentorId ||
      !form.durationInWeeks
    ) {
      return toastError("Please fill all required fields");
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    ) {
      return toastError("End date must be after start date");
    }

    try {
      setLoading(true);

      await createProgram(form);

      toastSuccess("Internship program created successfully");

      refresh();
      onClose();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to create program");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Create Internship Program
        </h2>

        {/* Title */}
        <input
          name="title"
          placeholder="Program title"
          className="border p-3 w-full rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Domain */}
        <select
          name="domain"
          className="border p-3 w-full rounded"
          value={form.domain}
          onChange={handleChange}
          required
        >
          <option value="">Select domain</option>
          {domains.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Mentor */}
        <select
          name="mentorId"
          className="border p-3 w-full rounded"
          value={form.mentorId}
          onChange={handleChange}
          required
        >
          <option value="">Assign mentor</option>
          {mentors.map((mentor) => (
            <option key={mentor._id} value={mentor._id}>
              {mentor.name}
            </option>
          ))}
        </select>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            className="border p-3 rounded"
            value={form.startDate}
            onChange={handleChange}
          />

          <input
            type="date"
            name="endDate"
            className="border p-3 rounded"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Duration In Week */}
        <input
          type="number"
          value={form.durationInWeeks}
          readOnly
          placeholder="Duration in weeks"
          className="border p-3 w-full rounded bg-gray-100 cursor-not-allowed"
        />

        {/* Description */}
        <textarea
          name="description"
          rows="3"
          placeholder="Program description"
          className="border p-3 w-full rounded"
          value={form.description}
          onChange={handleChange}
        />

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
