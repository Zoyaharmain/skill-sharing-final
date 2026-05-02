import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "../NotificationBell";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
  <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-3">
      
      {/* Hamburger (move here) */}
      <button
        className="md:hidden p-2 bg-gray-200 rounded"
        onClick={() => document.dispatchEvent(new Event("openSidebar"))}
      >
        ☰
      </button>

      <h1 className="text-xl font-bold text-blue-600 tracking-wide">
        Neighbourhood Skill Sharing
      </h1>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">
      <NotificationBell />

      <div className="relative z-[10000]" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm hover:shadow-md transition bg-[var(--card)] text-[var(--text)] border-[var(--border)]"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
            {initial}
          </div>

          <span className="text-sm font-medium">
            {user?.username || "User"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-56 z-[11000] backdrop-blur-xl shadow-xl rounded-xl p-3 animate-dropdown bg-[var(--card)] text-[var(--text)] border border-[var(--border)]">
            <div className="mb-2 border-b pb-2 border-[var(--border)]">
              <p className="font-semibold">{user?.username}</p>
              <p className="text-xs opacity-70">{user?.email}</p>
            </div>

            <button
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg)] transition text-sm"
            >
              👤 Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-100 text-red-500 transition text-sm"
            >
              🚪 Logout
            </button>

            <div className="border-t mt-2 pt-2 border-[var(--border)]">
              <p className="text-xs opacity-70 px-2 mb-1">Theme</p>

              <button onClick={() => setTheme("light")} className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm">☀️ Light</button>
              <button onClick={() => setTheme("dark")} className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm">🌙 Dark</button>

            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
export default Navbar;

