// /utils/api.ts
import axios from "axios";
import { authStore } from "../app/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await authStore.refresh();
      originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
