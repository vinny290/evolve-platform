"use client";

import React, { createContext, useContext } from "react";
import { AuthStore } from "./authStore";
import { CourseStore } from "./сourseStore";
import { UserStore } from "./userStore";

class RootStore {
  authStore: AuthStore;
  courseStore: CourseStore;
  userStore: UserStore;

  constructor() {
    this.authStore = new AuthStore();
    this.courseStore = new CourseStore();
    this.userStore = new UserStore();
  }

  async init() {
    this.authStore.isLoading = true;

    try {
      if (this.authStore.accessToken) {
        this.userStore.setUserFromToken(this.authStore.accessToken);
        await this.userStore.loadUser();
      }
    } finally {
      this.authStore.isLoading = false;
    }
  }

  async login(email: string, password: string) {
    await this.authStore.login(email, password);

    if (this.authStore.accessToken) {
      this.userStore.setUserFromToken(this.authStore.accessToken);
      await this.userStore.loadUser();
    }
  }

  async register(email: string, password: string) {
    await this.authStore.register(email, password);

    if (this.authStore.accessToken) {
      this.userStore.setUserFromToken(this.authStore.accessToken);
      await this.userStore.loadUser();
    }
  }

  logout() {
    this.authStore.logoutLocal();
    this.userStore.clear();
  }
}

export const rootStore = new RootStore();

const StoreContext = createContext(rootStore);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useRootStore = () => useContext(StoreContext);
