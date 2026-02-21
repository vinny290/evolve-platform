"use client";
import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { useRouter } from "next/navigation";
import API_ENDPOINTS from "../../utils/apiEndpoints";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  user: any = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  async login(email: string, password: string) {
    // const router = useRouter();
    this.loading = true;
    try {
      const { data } = await axios.post(API_ENDPOINTS.auth.login, {
        email,
        password,
      });
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      });
      //   router.push("/dashboard");
      return true;
    } catch (e) {
      console.error("Login failed", e);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async register(email: string, password: string) {
    this.loading = true;
    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        email,
        password,
      });
      return Boolean(response.data);
    } catch (e: any) {
      console.error("Register failed:", e.response?.data || e.message);
      throw e;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async refresh() {
    if (!this.refreshToken) return;
    try {
      const { data } = await axios.post<AuthResponse>("/api/refresh", {
        refreshToken: this.refreshToken,
      });
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      });
    } catch (e) {
      console.error("Refresh token failed", e);
      this.logout();
    }
  }

  logout() {
    const router = useRouter();
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  }
}

export const authStore = new AuthStore();
