import axios from "axios";

// Backend API base URL
const API = axios.create({
  baseURL: "https://skill-sharing-final.onrender.com",
  withCredentials: true,
});

// Attach JWT token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response/error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

// Geoapify API Key
export const GEOAPIFY_API_KEY =
  import.meta.env.VITE_GEOAPIFY_API_KEY || "";

export default API;