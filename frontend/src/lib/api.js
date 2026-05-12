import store, { logout } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // If you use cookies
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logout logic here
      localStorage.removeItem("token"); // Or your token key
      store.dispatch(logout());
      // Optionally, redirect:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;