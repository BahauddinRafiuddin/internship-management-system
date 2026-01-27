import { useEffect, useState } from "react";
import { getAllPrograms, changeProgramStatus } from "../../api/program.api";

import ProgramStatusBadge from "../../components/program/ProgramStatusBadge";
import EnrollInternModal from "../../components/program/EnrollInternModal";
import CreateProgramModal from "../../components/program/CreateProgramModal";
import { toastError, toastSuccess } from "../../utils/toast";
import UpdateProgramModal from "../../components/program/UpdateProgramModal";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editProgram, setEditProgram] = useState(null);

  const fetchPrograms = async () => {
    try {
      const res = await getAllPrograms();
      setAllPrograms(res.programs);
      setPrograms(res.programs);
    } catch (err) {
      toastError(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Change status
  const handleStatusChange = async (program) => {
    let nextStatus = "active";

    if (program.status === "upcoming") nextStatus = "active";
    else if (program.status === "active") nextStatus = "completed";

    try {
      await changeProgramStatus(program._id, nextStatus);
      toastSuccess(`Program marked as ${nextStatus}`);
      fetchPrograms();
    } catch (err) {
      toastError(err.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setPrograms(allPrograms);
      return;
    }

    const value = search.toLowerCase();
    const filtered = allPrograms.filter(
      (program) =>
        program.title.toLowerCase().includes(value) ||
        program.domain.toLowerCase().includes(value) ||
        program.mentor.name.toLowerCase().includes(value) ||
        program.status.toLowerCase().includes(value),
    );

    setPrograms(filtered);
  }, [search, allPrograms]);
  return (
    <div>
      {/* Create modal */}
      {showCreate && (
        <CreateProgramModal
          onClose={() => setShowCreate(false)}
          refresh={fetchPrograms}
        />
      )}

      {/* Enroll modal */}
      {selectedProgram && (
        <EnrollInternModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          refresh={fetchPrograms}
        />
      )}
      {editProgram && (
        <UpdateProgramModal
          program={editProgram}
          onClose={() => setEditProgram(null)}
          refresh={fetchPrograms}
        />
      )}

      {/* Table */}
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Internship Programs
          </h1>
          <input
            placeholder="Search programs by name or status .."
            className="border-b-2 border-blue-400 px-4 py-2 rounded-lg w-full sm:w-80 focus:ring-2 focus:border-0 ring-blue-400 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer transition"
          >
            + Create Program
          </button>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Program</th>
                <th className="p-4 text-left">Domain</th>
                <th className="p-4 text-left">Mentor</th>
                <th className="p-4 text-center">Interns</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {programs.map((program) => (
                <tr
                  key={program._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {program.title}
                  </td>

                  <td className="p-4 text-gray-600">{program.domain}</td>

                  <td className="p-4">{program.mentor?.name || "—"}</td>

                  <td className="p-4 text-center font-medium">
                    {program.interns.length}
                  </td>

                  <td className="p-4 text-center">
                    <ProgramStatusBadge status={program.status} />
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {program.status === "upcoming" && (
                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm cursor-pointer"
                        >
                          Enroll
                        </button>
                      )}

                      {program.status !== "completed" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(program)}
                            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-sm cursor-pointer"
                          >
                            Advance
                          </button>

                          <button
                            onClick={() => setEditProgram(program)}
                            className="px-3 py-1.5 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm cursor-pointer"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {programs.map((program) => (
            <div
              key={program._id}
              className="bg-white rounded-2xl shadow p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg">{program.title}</h2>

                <ProgramStatusBadge status={program.status} />
              </div>

              <p className="text-sm text-gray-600">
                <b>Domain:</b> {program.domain}
              </p>

              <p className="text-sm text-gray-600">
                <b>Mentor:</b> {program.mentor?.name || "—"}
              </p>

              <p className="text-sm text-gray-600">
                <b>Interns:</b> {program.interns.length}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {program.status === "upcoming" && (
                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded cursor-pointer"
                  >
                    Enroll
                  </button>
                )}

                {program.status !== "completed" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(program)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded cursor-pointer"
                    >
                      Advance
                    </button>

                    <button
                      onClick={() => setEditProgram(program)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programs;
