const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
const COURSE_URL = process.env.NEXT_PUBLIC_COURSE_URL;
const USER_URL = process.env.NEXT_PUBLIC_USER_URL;

export const API_ENDPOINTS = {
  auth: {
    register: `${AUTH_URL}/auth/register`,
    login: `${AUTH_URL}/auth/login`,
    refresh: `${AUTH_URL}/auth/refresh`,
  },
  course: `${COURSE_URL}/course`,
  user: `${USER_URL}/users`,
};

export default API_ENDPOINTS;
