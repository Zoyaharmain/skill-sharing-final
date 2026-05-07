import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/my");
      const data = res.data?.sessions || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    }
  };

  const selectedDateSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate.getFullYear() === date.getFullYear() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getDate() === date.getDate()
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      
      <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">
        My Schedule
      </h1>

      {/* RESPONSIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CALENDAR */}
        <div className="card p-4 w-full overflow-x-auto">
          <div className="min-w-[300px]">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date: tileDate }) => {
                const hasSession = sessions.some(session => {
                  return new Date(session.date).toDateString() === tileDate.toDateString();
                });

                return hasSession
                  ? "bg-blue-500 text-white rounded-full"
                  : null;
              }}
            />
          </div>
        </div>

        {/* SESSIONS */}
        <div className="card p-4 w-full">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Sessions on {date.toDateString()}
          </h2>

          {selectedDateSessions.length === 0 ? (
            <p className="opacity-60">No sessions</p>
          ) : (
            selectedDateSessions.map(session => (
              <div
                key={session._id}
                className="border border-[var(--border)] p-4 rounded-xl mb-3 hover:shadow-md transition bg-[var(--card)]"
              >
                <h3 className="font-bold text-lg">
                  {session.skill?.skillName}
                </h3>

                <p className="text-sm opacity-70">
                  👤 {session.mentor?.username}
                </p>

                <p className="text-sm">
                  ⏰ {session.time}
                </p>

                <div className="mt-2">
                  <StatusBadge status={session.status} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default CalendarPage;