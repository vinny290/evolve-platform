"use client";

import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { apiClient } from "../../lib/apiClient";
import API_ENDPOINTS from "../../utils/apiEndpoints";

interface JwtPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export class AuthStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  user: User | null = null;
  roles: string[] = [];
  isLoading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromCookies();
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      Cookies.set("accessToken", token);
    } else {
      Cookies.remove("accessToken");
    }
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (token) {
      Cookies.set("refreshToken", token);
    } else {
      Cookies.remove("refreshToken");
    }
  }

  setUser(user: User | null) {
    this.user = user;
    if (user) {
      Cookies.set("user", JSON.stringify(user));
    } else {
      Cookies.remove("user");
    }
  }

  loadFromCookies() {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const user = Cookies.get("user");

    if (accessToken) this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
    if (user) this.user = JSON.parse(user);
  }

  async loadUserFromToken(token: string) {
    const decoded = jwtDecode<JwtPayload>(token);
    const response = await apiClient.get(API_ENDPOINTS.users.profile);

    runInAction(() => {
      this.user = response.data;
      this.roles = decoded.roles;
      this.setUser(this.user);
    });
  }

  async login(email: string, password: string) {
    this.error = null;
    try {
      const response = await axios.post(
        API_ENDPOINTS.auth.login,
        { email, password },
        { withCredentials: false }, // теперь куки сами ставим
      );

      const { accessToken, refreshToken } = response.data;

      runInAction(() => {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
      });

      // await this.loadUserFromToken(accessToken);
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка при входе в систему";
      });
    }
  }

  async register(email: string, password: string) {
    this.error = null;
    try {
      await axios.post(
        API_ENDPOINTS.auth.register,
        { email, password },
        { withCredentials: false },
      );
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка при регистрации";
      });
    }
  }

  async refreshTokenRequest() {
    if (!this.refreshToken) return;
    try {
      const response = await axios.post(
        API_ENDPOINTS.auth.refresh,
        { refreshToken: this.refreshToken },
        { withCredentials: false },
      );

      const newAccessToken = response.data.accessToken;
      runInAction(() => {
        this.setAccessToken(newAccessToken);
      });

      await this.loadUserFromToken(newAccessToken);
    } catch {
      this.logoutLocal();
    }
  }

  async logout() {
    this.logoutLocal();
  }

  logoutLocal() {
    this.setAccessToken(null);
    this.setRefreshToken(null);
    this.setUser(null);
    this.roles = [];
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }

  async initAuth() {
    this.isLoading = true;
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        this.setAccessToken(token);
        await this.loadUserFromToken(token);
      } else {
        this.logoutLocal();
      }
    } finally {
      this.isLoading = false;
    }
  }
}
