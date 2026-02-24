"use client";

import { useRootStore } from "../app/stores";

export const useAuth = () => {
  const { authStore } = useRootStore();
  return authStore;
};
