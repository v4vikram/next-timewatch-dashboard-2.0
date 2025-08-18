// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3001/api"
  baseURL: "https://timewatch-dashboard-bk-311005204045.europe-west1.run.app/api"
});

export default axiosInstance
