"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRootStore } from "../app/stores";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = observer(({ children, requiredRoles }: Props) => {
  const { authStore, userStore } = useRootStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
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
    isClient,
    authStore.isLoading,
    authStore.isAuthenticated,
    userStore.roles,
    router,
    requiredRoles,
  ]);

  if (!isClient || authStore.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!authStore.isAuthenticated) {
    return null;
  }

  if (
    requiredRoles &&
    !requiredRoles.some((role) => userStore.roles.includes(role))
  ) {
    return <div>Нет доступа</div>;
  }

  return <>{children}</>;
});
