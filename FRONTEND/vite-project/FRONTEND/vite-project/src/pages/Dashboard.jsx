import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [dashboard, setDashboard] = useState({
  skillsCount: 0,
  sessionsCount: 0,
  pendingCount: 0,
  });
  const recentSessions = sessions.slice(0, 3);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/my");
      setSessions(res.data.sessions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
  try {
    const res = await API.get("/dashboard");
    setDashboard(res.data.data);
  } catch (err) {
    console.log("Dashboard error:", err);
  }
};

  useEffect(() => {
    fetchSessions();
    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading sessions...</p>;
  }

  return (
    <div className="w-full p-4 sm:p-6">

    {/* DASHBOARD STATS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      <div className="flex-1 p-6 rounded-xl shadow-md bg-purple-500 text-white">
        <h2 className="text-lg font-semibold">My Skills</h2>
        <p className="text-3xl font-bold mt-2">{dashboard.skillsCount}</p>
      </div>

      <div className="flex-1 p-6 rounded-xl shadow-md bg-purple-500 text-white">
        <h2 className="text-lg font-semibold">My Sessions</h2>
        <p className="text-3xl font-bold mt-2">{dashboard.sessionsCount}</p>
      </div>

      <div className="flex-1 p-6 rounded-xl shadow-md bg-purple-500 text-white">
        <h2 className="text-lg font-semibold">Pending Requests</h2>
        <p className="text-3xl font-bold mt-2">{dashboard.pendingCount}</p>
      </div>

    </div>

    {/* QUICK ACTIONS */}
    
      <div className="mt-8 border border-gray-600 rounded-xl p-5 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <button
          onClick={() => navigate("/skills")}
          className="p-5 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition shadow-sm"
        >
          ✏️ Update Profile
        </button>

        <button
          onClick={() => navigate("/nearby")}
          className="p-5 rounded-xl bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition shadow-sm"
        >
          📍 Find Nearby
        </button>

        <button
          onClick={() => navigate("/manage-sessions")}
          className="p-5 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition shadow-sm"
        >
          📅 Book Session
        </button>

      </div>
    </div>

    {/* MY SESSIONS */}
    <div className="mt-10">

      <h2 className="text-2xl font-bold text-gray-900">
        MY SESSIONS
      </h2>
      <div className="w-24 h-1 bg-blue-500 mt-2 rounded"></div>

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {recentSessions.map(session => (
            <div
              key={session._id}
              className="p-5 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-lg transition duration-300"
            >
              <h3 className="font-bold text-lg">
                {session.skill?.skillName || "No Skill"}
              </h3>

              <p className="text-sm opacity-70">
                Mentor: {session.mentor?.username || "Unknown"}
              </p>

              <p className="mt-2 text-sm">
                📅 {session.date ? new Date(session.date).toLocaleDateString() : "No Date"}
              </p>

              <p className="text-sm">⏰ {session.time || "No Time"}</p>

              <p
                className={`mt-2 text-sm font-semibold ${
                  session.status === "Pending"
                    ? "text-yellow-500"
                    : session.status === "Accepted"
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                Status: {session.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl shadow text-center opacity-70 mt-6">
          No sessions booked yet 🚀
        </div>
      )}

    </div>
     
    {/* REVIEW MODAL */}
    {selectedSession && (
      <ReviewModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    )}

  </div>
);
  
}

export default Dashboard;