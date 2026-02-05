import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import {
  getAllInterns,
  getAllMentors,
  getAllPrograms,
} from "../../api/admin.api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    interns: 0,
    activeInterns: 0,
    mentors: 0,
    programs: 0,
    activePrograms: 0,
    completedPrograms: 0,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDashboard = async (params) => {
      try {
        const internRes = await getAllInterns();
        const mentorRes = await getAllMentors();
        const programRes = await getAllPrograms();

        const interns = internRes.interns || [];
        const mentors = mentorRes.mentors || [];
        const programs = programRes.programs || [];

        setStats({
          interns: interns.length,
          activeInterns: interns.filter((i) => i.isActive).length,
          mentors: mentors.length,
          programs: programs.length,
          activePrograms: programs.filter((p) => p.status === "active").length,
          completedPrograms: programs.filter((p) => p.status === "completed")
            .length,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          System summary and real-time statistics
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* CARD */}
        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-blue-500">
          <p className="text-gray-500 text-sm">Total Interns</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.interns}
          </h2>
        </div>

        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-green-500">
          <p className="text-gray-500 text-sm">Active Interns</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.activeInterns}
          </h2>
        </div>

        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-purple-500">
          <p className="text-gray-500 text-sm">Mentors</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.mentors}
          </h2>
        </div>

        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-yellow-500">
          <p className="text-gray-500 text-sm">Programs</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.programs}
          </h2>
        </div>

        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-indigo-500">
          <p className="text-gray-500 text-sm">Active Programs</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.activePrograms}
          </h2>
        </div>

        <div className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border-l-8 border-red-500">
          <p className="text-gray-500 text-sm">Completed Programs</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            {stats.completedPrograms}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
