"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRootStore } from "../app/stores";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = observer(({ children, requiredRoles }: Props) => {
  const { authStore, userStore } = useRootStore();
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isLoading) {
      if (!authStore.isAuthenticated) {
        router.replace("/auth");
        return;
      }

      if (
        requiredRoles &&
        !requiredRoles.some((role) => userStore.roles.includes(role))
      ) {
        router.replace("/auth");
      }
    }
  }, [
    authStore.isLoading,
    authStore.isAuthenticated,
    userStore.roles,
    router,
    requiredRoles,
  ]);

  if (authStore.isLoading) return <div>Загрузка...</div>;
  if (!authStore.isAuthenticated) return null;

  if (
    requiredRoles &&
    !requiredRoles.some((role) => userStore.roles.includes(role))
  ) {
    return <div>Нет доступа</div>;
  }

  return <>{children}</>;
});
