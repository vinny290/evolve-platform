import axios from "axios";
import { rootStore } from "../app/stores";

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = rootStore.authStore.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// автоматический рефреш при 401
let isRefreshing = false;
let queue: any[] = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await rootStore.authStore.refreshTokenRequest();
        queue.forEach((cb) => cb());
        queue = [];
        return apiClient(originalRequest);
      } catch {
        queue = [];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);
