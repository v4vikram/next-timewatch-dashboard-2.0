
import axios from '@/lib/axiosInstance';

// 🔐 Login user and return user info
export async function loginUser(credentials) {
  await axios.post('/api/login', credentials, {
    withCredentials: true,
  });

  const userRes = await axios.get('/api/me', {
    withCredentials: true,
  });

  return userRes?.data?.user || null;
}

// 🆕 Register user
export async function registerUser(values) {
  const res = await axios.post("/api/register", values, {
    withCredentials: true,
  });
  return res.data;
}

// 👤 Get currently logged-in user
export async function getUser() {
  const res = await axios.get("/api/me", { withCredentials: true });
  return res.data.user;
}

export async function logoutUser() {
  await axios.post("/api/logout", {}, { withCredentials: true });
  return true;
}
