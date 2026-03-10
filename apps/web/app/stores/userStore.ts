import { apiClient } from "lib/apiClient";
import { makeAutoObservable, runInAction } from "mobx";
import API_ENDPOINTS from "utils/apiEndpoints";
import { jwtDecode } from "jwt-decode";
import { createRef } from "react";

interface JwtPayload {
  sub: string;
  roles: string[];
}

export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
};

export class UserStore {
  user: User | null = null;
  roles: string[] = [];
  userId: string | null = null;
  firstName = "";
  lastName = "";
  email = "";
  isEditing = false;
  isEditModalOpen = false;

  isLoading = false;
  error: string | null = null;
  avatarFile: File | null = null;
  fileInputRef = createRef<HTMLInputElement>();

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Извлекаем userId и роли из accessToken
   */
  setUserFromToken(token: string) {
    const decoded = jwtDecode<JwtPayload>(token);

    runInAction(() => {
      this.userId = decoded.sub;
      this.roles = decoded.roles;
    });
  }

  setAvatarFile(file: File | null) {
    this.avatarFile = file;
  }

  get avatarPreview() {
    if (this.avatarFile) {
      return URL.createObjectURL(this.avatarFile);
    }
    return this.user?.avatarUrl;
  }

  /**
   * Загружаем данные пользователя с сервера
   */
  async loadUser() {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get<User>(
        `${API_ENDPOINTS.user}/${this.userId}`,
      );

      runInAction(() => {
        this.user = response.data;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error =
          e.response?.data?.message || "Ошибка загрузки пользователя";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateUser() {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    try {
      const formData = new FormData();

      const request = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
          type: "application/json",
        }),
      );

      if (this.avatarFile) {
        formData.append("file", this.avatarFile);
      }

      const response = await apiClient.patch<User>(
        `${API_ENDPOINTS.user}/${this.userId}`,
        formData,
      );

      runInAction(() => {
        this.user = response.data;
        this.avatarFile = null;
        this.isEditModalOpen = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error =
          e.response?.data?.message || "Ошибка обновления пользователя";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  openEditModal() {
    if (!this.user) return;

    this.firstName = this.user.firstName || "";
    this.lastName = this.user.lastName || "";
    this.email = this.user.email;

    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  startEditing() {
    if (!this.user) return;

    this.firstName = this.user.firstName || "";
    this.lastName = this.user.lastName || "";
    this.email = this.user.email;
    this.isEditing = true;
  }
  cancelEditing() {
    this.isEditing = false;
  }

  setFirstName(value: string) {
    this.firstName = value;
  }

  setLastName(value: string) {
    this.lastName = value;
  }

  setEmail(value: string) {
    this.email = value;
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }

  clear() {
    this.user = null;
    this.roles = [];
    this.userId = null;
  }
}
