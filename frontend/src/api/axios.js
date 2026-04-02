import axios from "axios";

export const API_BASE_URL = "https://social-app-28qw.onrender.com";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

export default api;
