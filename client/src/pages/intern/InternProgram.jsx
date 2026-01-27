import { useEffect, useState } from "react";
import { getMyProgram } from "../../api/intern.api";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Users,
  BookOpen
} from "lucide-react";

const statusColor = {
  upcoming: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700"
};

const InternPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // assume auth context gives this
  const internId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getMyProgram();
        setPrograms(res.program || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading)
    return <div className="text-center py-20">Loading programs...</div>;

  if (!programs.length)
    return (
      <div className="bg-white p-10 rounded-xl text-center shadow">
        <BookOpen className="mx-auto text-gray-400 mb-4" size={40} />
        <h2 className="text-xl font-semibold">No Programs Found</h2>
        <p className="text-gray-500 mt-2">
          You are not enrolled in any program yet.
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        My Internship Programs
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {programs.map((program) => {
          const myEnrollment = program.interns.find(
            (i) => i.intern === internId
          );

          return (
            <div
              key={program._id}
              className="bg-white rounded-2xl shadow p-6 space-y-5 hover:shadow-lg transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  {program.title}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    statusColor[program.status]
                  }`}
                >
                  {program.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600">{program.description}</p>

              {/* INFO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} /> Domain: {program.domain}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} /> Duration:{" "}
                  {program.durationInWeeks} weeks
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(program.startDate).toDateString()} →{" "}
                  {new Date(program.endDate).toDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Total Interns: {program.interns.length}
                </div>
              </div>

              {/* MENTOR */}
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-gray-800">
                  Assigned Mentor
                </h3>

                <div className="flex items-center gap-3 text-sm">
                  <User size={16} />
                  {program.mentor.name}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} />
                  {program.mentor.email}
                </div>
              </div>

              {/* ENROLL INFO */}
              {myEnrollment && (
                <div className="text-xs text-gray-500 pt-2">
                  Enrolled on:{" "}
                  {new Date(
                    myEnrollment.enrolledAt
                  ).toDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InternPrograms;
