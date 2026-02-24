"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = observer(({ children, requiredRoles }: Props) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        router.replace("/login");
      } else if (
        requiredRoles &&
        !requiredRoles.some((role) => auth.roles.includes(role))
      ) {
        router.replace("/dashboard");
      }
    }
  }, [auth, router, requiredRoles]);

  if (auth.isLoading) return <div>Загрузка...</div>;
  if (!auth.isAuthenticated) return null;

  if (
    requiredRoles &&
    !requiredRoles.some((role) => auth.roles.includes(role))
  ) {
    return <div>Нет доступа</div>;
  }

  return <>{children}</>;
});
