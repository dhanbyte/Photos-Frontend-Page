// src/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://photos-backend-page-cwvu.onrender.com/api",
});

export default API;
