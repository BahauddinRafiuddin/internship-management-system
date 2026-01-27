import React, { useEffect, useState } from "react";
import { createMentor, getAllMentors } from "../../api/admin.api";
import { toastError, toastSuccess } from "../../utils/toast";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchMentors = async () => {
    const res = await getAllMentors();
    setAllMentors(res.mentors);
    setMentors(res.mentors);
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Search
  useEffect(() => {
    if (!search.trim()) {
      setMentors(allMentors);
      return;
    }
    const value = search.toLowerCase();
    const filtered = allMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(value) ||
        mentor.email.toLowerCase().includes(value),
    );

    setMentors(filtered)
  }, [search, allMentors]);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createMentor(form);
      toastSuccess(res.message);
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchMentors();
    } catch (err) {
      toastError(err.response?.data?.message || "Mentor creation failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create mentor */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            name="name"
            placeholder="Full name"
            className="border p-3 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-3 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            className="border p-3 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="md:col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Create Mentor
          </button>
        </form>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Mentor Management
          </h1>
          <input
            placeholder="Search mentors..."
            className="border-b-2 border-blue-400 px-4 py-2 rounded-lg w-full sm:w-80 focus:ring-2 focus:border-0 ring-blue-400 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            + Add Mentor
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Email</th>
                <th className="px-5 py-4 text-center">Interns</th>
              </tr>
            </thead>

            <tbody>
              {mentors.map((mentor) => (
                <tr
                  key={mentor._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4 font-medium">{mentor.name}</td>

                  <td className="px-5 py-4 text-gray-600">{mentor.email}</td>

                  <td className="px-5 py-4 text-center font-semibold">
                    {mentor.internCount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-2xl shadow p-5">
              <h2 className="font-semibold text-lg">{mentor.name}</h2>

              <p className="text-gray-600 text-sm">{mentor.email}</p>

              <p className="mt-2 text-sm">
                <b>Interns:</b> {mentor.internCount || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentors;
