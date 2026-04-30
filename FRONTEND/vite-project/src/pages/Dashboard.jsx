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
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
  {/* EVERYTHING inside dashboard */}

    <div className="bg-[var(--bg)] text-[var(--text)]"> {/* 🔥 ADDED */}

      {/* DASHBOARD STATS */}
      <div className="flex gap-6 mb-6">

  <div className="flex-1 p-6 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-[1.02] transition">
    <h2 className="text-base font-medium opacity-90">My Skills</h2>
<p className="text-2xl font-semibold mt-2">{dashboard.skillsCount}</p>
  </div>

  <div className="flex-1 p-6 rounded-xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-[1.02] transition">
   <h2 className="text-base font-medium opacity-90">My Sessions</h2>
<p className="text-2xl font-semibold mt-2">{dashboard.sessionsCount}</p>
  </div>

  <div className="flex-1 p-6 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] transition">
    <h2 className="text-base font-medium opacity-90">Pending Requests</h2>
    <p className="text-2xl font-semibold mt-2">{dashboard.pendingCount}</p>
  </div>

</div>
        
        {/* QUICK ACTIONS */}
   {/* QUICK ACTIONS */}
<div className="mt-8 p-6 rounded-2xl shadow-md bg-white border">

  <h2 className="text-lg font-semibold mb-4 text-gray-700">
    Quick Actions
  </h2>

  <div className="grid grid-cols-3 gap-6">

    <button
      onClick={() => navigate("/skills")}
      className="p-5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition shadow-sm text-base"
    >
      ✏️ Update Profile
    </button>

    <button
      onClick={() => navigate("/nearby")}
      className="p-5 rounded-xl bg-purple-50 text-purple-600 font-medium hover:bg-purple-100 transition shadow-sm text-base"
    >
      📍 Find Nearby
    </button>

    <button
      onClick={() => navigate("/manage-sessions")}
      className="p-5 rounded-xl bg-green-50 text-green-600 font-medium hover:bg-green-100 transition shadow-sm text-base"
    >
      📅 Book Session
    </button>

  </div>

</div>

      {/* MY SESSIONS */}
      <div>
      <div className="mt-10 mb-4">
  <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
    MY SESSIONS
  </h2>
  <div className="w-22 h-1 bg-blue-500 mt-2 rounded"></div>
</div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {recentSessions.map(session => (
              <div
                key={session._id}
                className="card p-5 rounded-xl shadow hover:shadow-lg transition" // 🔥 CHANGE
              >
                <h3 className="font-bold text-lg">
                  {session.skill?.skillName || "No Skill"}
                </h3>

                
                <p className="text-sm text-[var(--text)] opacity-70">
                  Mentor: {session.mentor?.username || "Unknown"}
                </p>

                <p className="mt-2 text-sm">
                  📅 {session.date ? new Date(session.date).toLocaleDateString() : "No Date"}
                </p>

                <p className="text-sm">⏰ {session.time || "No Time"}</p>

                <p
                  className={`mt-2 text-sm font-semibold 
                  ${
                    session.status === "Pending"
                      ? "text-yellow-500"
                      : session.status === "Accepted"
                        ? "text-green-500"
                        : session.status === "Completed"
                          ? "text-blue-500"
                          : "text-gray-500"
                  }`}
                >
                  Status: {session.status}
                </p>

              </div>
            ))}
          </div>
        ) : (
          
          <div className="card p-6 rounded-xl shadow text-center opacity-70">
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
    </div>
  );
}

export default Dashboard;