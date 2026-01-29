import React, { useEffect, useState } from "react";
import {
  assignMentor,
  getAllInterns,
  getAllMentors,
  updateInternStatus,
} from "../../api/admin.api";
import { toastError, toastSuccess } from "../../utils/toast";
import StatCard from "../../components/ui/StatCard";
import { Users, UserCheck, UserX, SearchX } from "lucide-react";

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [allInterns, setAllInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const internRes = await getAllInterns();
      const mentorRes = await getAllMentors();

      setAllInterns(internRes.interns);
      setInterns(internRes.interns);
      setMentors(mentorRes.mentors);
    } catch {
      toastError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeInterns = interns.filter((i) => i.isActive).length;
  const inactiveInterns = interns.length - activeInterns;

  const handleStatusToggle = async (id, status) => {
    try {
      const res = await updateInternStatus(id, status);
      toastSuccess(res.message);
      fetchData();
    } catch (err) {
      toastError(err.response?.data?.message);
    }
  };

  // ================= SEARCH =================
  useEffect(() => {
    if (!search.trim()) {
      setInterns(allInterns);
      return;
    }

    const value = search.trim().toLowerCase();

    const filtered = allInterns.filter(
      (intern) =>
        intern.name.toLowerCase().includes(value) ||
        intern.email.toLowerCase().includes(value)
    );

    setInterns(filtered);
  }, [search, allInterns]);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500">
        Loading interns...
      </div>
    );

  return (
    <div className="space-y-8">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Interns"
          value={interns.length}
          icon={Users}
          color="bg-blue-600"
        />

        <StatCard
          title="Active Interns"
          value={activeInterns}
          icon={UserCheck}
          color="bg-green-600"
        />

        <StatCard
          title="Inactive Interns"
          value={inactiveInterns}
          icon={UserX}
          color="bg-red-600"
        />
      </div>

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Intern Management
        </h1>

        <input
          placeholder="Search interns by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:w-80
            px-4 py-2
            rounded-xl
            border
            focus:ring-2 focus:ring-blue-500
            outline-none
          "
        />
      </div>

      {/* ================= EMPTY ================= */}
      {interns.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-14 flex flex-col items-center text-center space-y-4">
          <SearchX className="w-20 h-20 text-blue-500 opacity-70" />
          <h2 className="text-xl font-semibold">
            No interns found
          </h2>
          <p className="text-gray-500 max-w-md">
            Try adjusting your search keywords.
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
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Intern
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mentor
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {interns.map((intern) => (
                  <tr
                    key={intern._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {intern.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {intern.email}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          intern.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {intern.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {intern.mentor?.name || (
                        <span className="text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleStatusToggle(
                            intern._id,
                            !intern.isActive
                          )
                        }
                        className={`
                          cursor-pointer
                          px-4 py-2 rounded-lg text-sm font-medium
                          ${
                            intern.isActive
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        `}
                      >
                        {intern.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
            {interns.map((intern) => (
              <div
                key={intern._id}
                className="bg-white rounded-2xl shadow p-5 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">
                    {intern.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      intern.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {intern.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {intern.email}
                </p>

                <p className="text-sm">
                  <b>Mentor:</b>{" "}
                  {intern.mentor?.name || "Not assigned"}
                </p>

                <button
                  onClick={() =>
                    handleStatusToggle(
                      intern._id,
                      !intern.isActive
                    )
                  }
                  className={`
                    cursor-pointer
                    w-full py-2 rounded-lg font-medium
                    ${
                      intern.isActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                  `}
                >
                  {intern.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Interns;
