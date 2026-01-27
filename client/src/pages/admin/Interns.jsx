import React, { useEffect, useState } from "react";
import {
  assignMentor,
  getAllInterns,
  getAllMentors,
  updateInternStatus,
} from "../../api/admin.api";
import { toastError, toastSuccess } from "../../utils/toast";
import StatCard from "../../components/ui/StatCard";
import { Users, UserCheck, UserX } from "lucide-react";

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

  useEffect(() => {
    if (!search.trim()) {
      setInterns(allInterns);
      return;
    }

    const value = search.toLowerCase();

    const filtered = allInterns.filter(
      (intern) =>
        intern.name.toLowerCase().includes(value) ||
        intern.email.toLowerCase().includes(value) 
        // intern.mentor?.name?.toLowerCase().includes(value)
        // (intern.isActive ? "active" : "inactive").includes(value),
    );

    setInterns(filtered);
  }, [search, allInterns]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* ================= TABLE ================= */}
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Intern Management
          </h1>
          <input
            placeholder="Search interns..."
            className="border-b-2 border-blue-400 px-4 py-2 rounded-lg w-full sm:w-80 focus:ring-2 focus:border-0 ring-blue-400 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Mentor
                </th>
                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {interns.map((intern) => (
                <tr
                  key={intern._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4 font-medium">{intern.name}</td>

                  <td className="px-5 py-4 text-gray-600">{intern.email}</td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      intern.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    >
                      {intern.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {intern.mentor?.name || (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        handleStatusToggle(intern._id, !intern.isActive)
                      }
                      className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      {intern.isActive ? "Deactivate" : "Activate"}
                    </button>

                    {/* <select
                      className="border rounded px-3 py-1.5 text-sm cursor-pointer"
                      value={intern.mentor?._id || ""}
                      onChange={(e) =>
                        handleAssignMentor(intern._id, e.target.value)
                      }
                    >
                      <option value="">Assign mentor</option>
                      {mentors.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {interns.map((intern) => (
            <div
              key={intern._id}
              className="bg-white rounded-2xl shadow p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg">{intern.name}</h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  intern.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                >
                  {intern.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-600">{intern.email}</p>

              <p className="text-sm">
                <b>Mentor:</b> {intern.mentor?.name || "Not assigned"}
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() =>
                    handleStatusToggle(intern._id, !intern.isActive)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer"
                >
                  {intern.isActive ? "Deactivate" : "Activate"}
                </button>

                {/* <select
                  className="border rounded px-3 py-2 cursor-pointer"
                  value={intern.mentor?._id || ""}
                  onChange={(e) =>
                    handleAssignMentor(intern._id, e.target.value)
                  }
                >
                  <option value="">Assign mentor</option>
                  {mentors.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interns;
