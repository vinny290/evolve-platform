const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    refresh: `${BASE_URL}/auth/refresh`,
  },
  // Пример других модулей:
  users: {
    list: `${BASE_URL}/api/v1/users`,
    profile: `${BASE_URL}/api/v1/users/profile`,
  },
  dashboard: {
    stats: `${BASE_URL}/api/v1/dashboard/stats`,
  },
};

export default API_ENDPOINTS;
