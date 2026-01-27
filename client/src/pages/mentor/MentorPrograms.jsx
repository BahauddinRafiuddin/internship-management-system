import { useEffect, useState } from "react";
import { getMentorPrograms } from "../../api/mentor.api";
import {
  BookOpen,
  Users,
  Calendar,
  Clock
} from "lucide-react";

const MentorPrograms = () => {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchMentorPrograms = async () => {
      try {
        const res = await getMentorPrograms();
        setPrograms(res.programs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorPrograms();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading programs...
      </div>
    );
  }

  if (!programs.length) {
    return (
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <BookOpen className="mx-auto text-gray-400 mb-4" size={44} />
        <h2 className="text-xl font-semibold">No Programs Found</h2>
        <p className="text-gray-500 mt-2">
          You are not assigned to any internship program yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          My Programs
        </h1>
        <p className="text-gray-500 mt-1">
          Internship programs assigned to you
        </p>
      </div>

      {/* ================= PROGRAM CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map(program => (
          <div
            key={program._id}
            className="bg-white rounded-2xl shadow p-6 space-y-4 hover:shadow-lg transition"
          >
            {/* TITLE */}
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-800">
                {program.title}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  program.status === "active"
                    ? "bg-green-100 text-green-700"
                    : program.status === "completed"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {program.status.toUpperCase()}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600">
              {program.description}
            </p>

            {/* INFO */}
            <div className="space-y-2 text-sm text-gray-700">

              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Domain: <b>{program.domain}</b>
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} />
                Interns Enrolled:{" "}
                <b>{program.interns?.length || 0}</b>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                Duration:{" "}
                <b>{program.durationInWeeks} weeks</b>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(program.startDate).toDateString()} —{" "}
                {new Date(program.endDate).toDateString()}
              </div>
            </div>

            {/* ACTION */}
            <div className="pt-4">
              <button
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer"
              >
                View Program →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MentorPrograms;
