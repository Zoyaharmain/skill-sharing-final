import { useEffect, useState } from "react";
import API from "../api/axios";

function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");
  const [loading, setLoading] = useState(true);

  const fetchExchanges = async () => {
    try {
      const res = await API.get("/exchange");

      console.log("EXCHANGE DATA:", res.data);

      setExchanges(res.data.exchanges || []);
    } catch (err) {
      console.error(
        "EXCHANGE ERROR:",
        err.response?.data || err.message
      );

      setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const incoming = exchanges.filter(
    (ex) => ex.receiver?._id === getUserId()
  );

  const outgoing = exchanges.filter(
    (ex) => ex.requester?._id === getUserId()
  );

  const handleAction = async (id, status) => {
    try {
      await API.patch(`/exchange/${id}`, { status });

      fetchExchanges();
    } catch (err) {
      console.error(
        "ACTION ERROR:",
        err.response?.data || err.message
      );

      alert("Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-lg">
        Loading exchange requests...
      </div>
    );
  }

  const currentData =
    activeTab === "incoming"
      ? incoming
      : outgoing;

  return (
    <div className="p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        Exchange Requests
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-4 py-1 rounded ${
            activeTab === "incoming"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Incoming
        </button>

        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-4 py-1 rounded ${
            activeTab === "outgoing"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Outgoing
        </button>
      </div>

      {/* Empty State */}
      {currentData.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          No exchange requests found.
        </div>
      ) : (
        currentData.map((ex) => (
          <div
            key={ex._id}
            className="bg-white text-black p-5 mb-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="font-semibold">
              {activeTab === "incoming"
                ? ex.requester?.username
                : ex.receiver?.username}
            </p>

            <p className="text-sm break-words">
              Learn:{" "}
              {ex.requestedSkill?.skillName ||
                "No Skill"}
            </p>

            <p className="text-sm break-words">
              Offer:{" "}
              {ex.offeredSkill?.skillName ||
                "No Skill"}
            </p>

            <p className="text-sm opacity-70">
              Status: {ex.status}
            </p>

            {activeTab === "incoming" &&
              ex.status === "Pending" && (
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() =>
                      handleAction(
                        ex._id,
                        "Accepted"
                      )
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        ex._id,
                        "Rejected"
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}

export default Exchange;

// Safer token parsing
function getUserId() {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload?._id || payload?.id || null;
  } catch (err) {
    console.log("TOKEN ERROR:", err);

    return null;
  }
}