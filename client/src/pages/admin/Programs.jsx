import { useEffect, useState } from "react";
import { getAllPrograms, changeProgramStatus } from "../../api/program.api";
import { SearchX } from "lucide-react";

import ProgramStatusBadge from "../../components/program/ProgramStatusBadge";
import EnrollInternModal from "../../components/program/EnrollInternModal";
import CreateProgramModal from "../../components/program/CreateProgramModal";
import UpdateProgramModal from "../../components/program/UpdateProgramModal";

import { toastError, toastSuccess } from "../../utils/toast";
import ConfirmModal from "../../components/common/ConfirmModal";

const Programs = () => {
  const [confirmData, setConfirmData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editProgram, setEditProgram] = useState(null);

  // ================= FETCH =================
  const fetchPrograms = async () => {
    try {
      const res = await getAllPrograms();
      setPrograms(res.programs);
      setAllPrograms(res.programs);
    } catch (err) {
      toastError(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ================= STATUS CHANGE =================
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

  // ================= SEARCH =================
  useEffect(() => {
    if (!search.trim()) {
      setPrograms(allPrograms);
      return;
    }

    const value = search.trim().toLowerCase();

    const filtered = allPrograms.filter(
      (p) =>
        p.title.toLowerCase().includes(value) ||
        p.domain.toLowerCase().includes(value) ||
        p.mentor?.name?.toLowerCase().includes(value) ||
        p.status.toLowerCase().includes(value),
    );

    setPrograms(filtered);
  }, [search, allPrograms]);

  return (
    <div className="space-y-8">
      {/* ================= MODALS ================= */}
      {showCreate && (
        <CreateProgramModal
          onClose={() => setShowCreate(false)}
          refresh={fetchPrograms}
        />
      )}

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

      {confirmData && (
        <ConfirmModal
          title="Confirm Program Status"
          message={`Are you sure you want to mark "${confirmData.program.title}" as "${confirmData.nextStatus}"? This action cannot be undone.`}
          onCancel={() => setConfirmData(null)}
          onConfirm={() => {
            handleStatusChange(confirmData.program);
            setConfirmData(null);
          }}
        />
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Internship Programs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage internship lifecycle and interns
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, domain, mentor or status..."
            className="
              w-full sm:w-80 px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-blue-500 outline-none
            "
          />

          <button
            onClick={() => setShowCreate(true)}
            className="
              cursor-pointer
              bg-linear-to-r from-blue-600 to-indigo-600
              hover:opacity-90
              text-white px-6 py-2.5 rounded-xl
              font-medium shadow
            "
          >
            + Create Program
          </button>
        </div>
      </div>

      {/* ================= EMPTY ================= */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-14 flex flex-col items-center text-center space-y-4">
          <SearchX className="w-20 h-20 text-blue-500 opacity-70" />

          <h2 className="text-xl font-semibold text-gray-800">
            No programs found
          </h2>

          <p className="text-gray-500 max-w-md">
            Try adjusting your search or clear the filter.
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
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program._id}
              className="
                bg-white rounded-2xl shadow-sm border
                p-6 hover:shadow-md transition
              "
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* INFO */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {program.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📘 {program.domain}</span>
                    <span>👨‍🏫 {program.mentor?.name || "—"}</span>
                    <span>👥 {program.interns.length} interns</span>
                  </div>
                </div>

                <div className="">
                  <ProgramStatusBadge status={program.status} />
                </div>
                {/* ACTIONS */}
                <div className="flex flex-wrap items-center gap-3">
                  {program.status === "upcoming" && (
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                    >
                      Enroll
                    </button>
                  )}

                  {program.status !== "completed" && (
                    <button
                      onClick={() =>
                        setConfirmData({
                          program,
                          nextStatus:
                            program.status === "upcoming"
                              ? "active"
                              : "completed",
                        })
                      }
                      className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
                        program.status === "upcoming"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {program.status === "upcoming" ? "Activate" : "Complete"}
                    </button>
                  )}

                  {program.status !== "completed" && (
                    <button
                      onClick={() => setEditProgram(program)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
