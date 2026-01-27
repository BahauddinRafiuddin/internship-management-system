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
          activePrograms: programs.filter((p) => p.stats === "active").length,
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Interns"
          value={stats.interns}
          color="border-blue-500"
        />
        <StatCard
          title="Active Interns"
          value={stats.activeInterns}
          color="border-green-500"
        />
        <StatCard
          title="Mentors"
          value={stats.mentors}
          color="border-purple-500"
        />
        <StatCard
          title="Programs"
          value={stats.programs}
          color="border-yellow-500"
        />
        <StatCard
          title="Active Programs"
          value={stats.activePrograms}
          color="border-indigo-500"
        />
        <StatCard
          title="Completed Programs"
          value={stats.completedPrograms}
          color="border-red-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
