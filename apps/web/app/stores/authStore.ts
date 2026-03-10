"use client";

import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import Cookies from "js-cookie";
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
  isLoading = false;
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

  loadFromCookies() {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken) this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  async login(email: string, password: string) {
    this.error = null;

    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      runInAction(() => {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка при регистрации";
      });

      throw e;
    }
  }

  async register(email: string, password: string) {
    this.error = null;

    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      runInAction(() => {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
      });

      return response;
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка при регистрации";
      });

      throw e;
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

      runInAction(() => {
        this.setAccessToken(response.data.accessToken);
      });
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
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }
}
