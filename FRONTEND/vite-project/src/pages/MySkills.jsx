import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function MySkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch skills
  const fetchSkills = async () => {
    try {
      const res = await API.get("/skills/my");

      console.log("MY SKILLS RESPONSE:", res.data);

      setSkills(res.data.data || []);
    } catch (err) {
      console.error(
        "FETCH SKILLS ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Failed to fetch skills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Delete skill
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this skill?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/skills/${id}`);

      fetchSkills();
    } catch (err) {
      console.error(
        "DELETE ERROR:",
        err.response?.data || err.message
      );

      alert("Failed to delete skill");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-xl">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">
        My Skills
      </h2>

      {/* Empty State */}
      {skills.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-lg text-gray-600">
            No skills added yet.
          </p>

          <button
            onClick={() => navigate("/skills")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white rounded-2xl shadow-md p-5"
            >
              {/* Video */}
              {skill.video?.url ? (
                <video
                  src={skill.video.url}
                  controls
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-3 text-sm text-gray-500">
                  No Video Available
                </div>
              )}

              <h3 className="font-bold text-lg text-black">
                {skill.skillName}
              </h3>

              <p className="text-sm text-gray-500">
                {skill.category} • {skill.mode}
              </p>

              <p className="text-sm mt-2 text-gray-700">
                {skill.description}
              </p>

              <p className="text-sm mt-1 text-gray-700">
                📍 {skill.location}
              </p>

              <p className="text-sm text-gray-700">
                Level: {skill.experienceLevel}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/edit-skill/${skill._id}`)
                  }
                  className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(skill._id)
                  }
                  className="w-1/2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySkills;