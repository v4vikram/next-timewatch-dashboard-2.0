// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://timewatch-dashboard-backend-311005204045.europe-west1.run.app/"
});

export default axiosInstance