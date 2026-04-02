import axios from "axios";

const api = axios.create({
    baseURL: "https://social-app-28qw.onrender.com/api",
    withCredentials: true,
});

export default api;
