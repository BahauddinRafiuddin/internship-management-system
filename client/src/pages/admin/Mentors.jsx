import React, { useEffect, useState } from "react";
import { createMentor, getAllMentors } from "../../api/admin.api";
import { toastError, toastSuccess } from "../../utils/toast";
import {
  User,
  Mail,
  Lock,
  X,
  Eye,
  EyeOff,
  SearchX,
} from "lucide-react";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex =
    /^[a-zA-Z][a-zA-Z0-9._%+-]{2,}@[a-z0-9.-]+\.[a-z]{2,}$/;
  const fullNameRegex = /^[A-Za-z ]{3,30}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

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

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) {
      setMentors(allMentors);
      return;
    }

    const value = search.trim().toLowerCase();

    const filtered = allMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(value) ||
        mentor.email.toLowerCase().includes(value)
    );

    setMentors(filtered);
  }, [search, allMentors]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    let err = {};

    if (!form.name.trim())
      err.name = "Full name is required";
    else if (!fullNameRegex.test(form.name))
      err.name = `"${form.name}" can't contain special character`;

    if (!emailRegex.test(form.email))
      err.email = `"${form.email}" is not a valid email address`;

    if (!passwordRegex.test(form.password))
      err.password =
        "Password must contain 1 capital letter, 1 number, 1 special character and minimum 8 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await createMentor(form);
      toastSuccess(res.message);
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchMentors();
    } catch (err) {
      toastError(
        err.response?.data?.message || "Mentor creation failed"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= CREATE MENTOR FORM ================= */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Create New Mentor
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
            >
              <X />
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none focus:ring-2
                    ${
                      errors.name
                        ? "border-red-500 ring-red-200"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none focus:ring-2
                    ${
                      errors.email
                        ? "border-red-500 ring-red-200"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none focus:ring-2
                    ${
                      errors.password
                        ? "border-red-500 ring-red-200"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium cursor-pointer"
            >
              Create Mentor
            </button>
          </div>
        </form>
      )}

      {/* ================= PAGE ================= */}
      <div className="space-y-6">
        {/* HEADER */}
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

        {/* ================= EMPTY STATE ================= */}
        {mentors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-14 flex flex-col items-center justify-center text-center space-y-4">
            <SearchX className="w-20 h-20 text-blue-500 opacity-80" />

            <h2 className="text-xl font-semibold text-gray-800">
              No mentors found
            </h2>

            <p className="text-gray-500 max-w-md">
              We couldn’t find any mentors matching your search.
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-5 py-4 text-left">
                      Name
                    </th>
                    <th className="px-5 py-4 text-left">
                      Email
                    </th>
                    <th className="px-5 py-4 text-center">
                      Interns
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr
                      key={mentor._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4 font-medium">
                        {mentor.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {mentor.email}
                      </td>
                      <td className="px-5 py-4 text-center font-semibold">
                        {mentor.internCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white rounded-2xl shadow p-5"
                >
                  <h2 className="font-semibold text-lg">
                    {mentor.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {mentor.email}
                  </p>
                  <p className="mt-2 text-sm">
                    <b>Interns:</b>{" "}
                    {mentor.internCount || 0}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mentors;
