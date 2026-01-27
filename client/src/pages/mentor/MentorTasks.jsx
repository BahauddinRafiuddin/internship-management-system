import { useEffect, useState } from "react";
import { getMentorPrograms, getMentorTasks } from "../../api/mentor.api";
import StatCard from "../../components/ui/StatCard";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import ReviewTaskModal from "../../components/mentor/ReviewTaskModal";
import CreateTaskModal from "../../components/mentor/CreateTaskModal";

const priorityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MentorTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [programs, setPrograms] = useState([]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const fetchTasks = async () => {
    try {
      const res = await getMentorTasks();
      setTasks(res.mentorTasks || []);
      setStats(res.stats || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchTasks();
  }, [showCreateModal]);


  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading mentor tasks...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <p className="text-gray-500 mt-1">
            Review intern submissions and manage tasks
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="
      px-5 py-2
      bg-indigo-600
      hover:bg-indigo-700
      text-white
      rounded-lg
      font-medium
      cursor-pointer
    "
        >
          + Create Task
        </button>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          programs={programs} // you already have or fetch
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTaskCreated}
        />
      )}

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks || 0}
          icon={ClipboardList}
          color="bg-blue-600"
        />

        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews || 0}
          icon={Clock}
          color="bg-yellow-500"
        />

        <StatCard
          title="Approved"
          value={stats.approvedTasks || 0}
          icon={CheckCircle}
          color="bg-green-600"
        />

        <StatCard
          title="Rejected"
          value={stats.rejectedTasks || 0}
          icon={XCircle}
          color="bg-red-600"
        />

        <StatCard
          title="Late"
          value={stats.lateSubmissions || 0}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-5 py-4 text-left">Task</th>
              <th className="px-5 py-4 text-left">Intern</th>
              <th className="px-5 py-4 text-center">Priority</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Deadline</th>
              <th className="px-5 py-4 text-center">Attempts</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </td>

                <td className="px-5 py-4">{task.assignedIntern?.name}</td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-center text-sm">
                  {new Date(task.deadline).toDateString()}
                </td>

                <td className="px-5 py-4 text-center">{task.attempts}</td>

                <td className="px-5 py-4 text-right">
                  {task.status === "submitted" &&
                  task.reviewStatus !== "reviewed" ? (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-indigo-600 hover:underline cursor-pointer"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-2xl shadow p-6 space-y-3"
          >
            <h2 className="font-bold text-lg">{task.title}</h2>

            <p className="text-sm text-gray-600">{task.description}</p>

            <p className="text-sm">
              <b>Intern:</b> {task.assignedIntern?.name}
            </p>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Deadline: {new Date(task.deadline).toDateString()}
            </p>

            {task.status === "submitted" &&
              task.reviewStatus !== "reviewed" && (
                <button
                  onClick={() => setSelectedTask(task)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                >
                  Review Task
                </button>
              )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <ReviewTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          refresh={fetchTasks}
        />
      )}
    </div>
  );
};

export default MentorTasks;
