"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRootStore } from "app/stores";

export default observer(function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authStore } = useRootStore();
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isLoading && authStore.isAuthenticated) {
      router.replace("/auth");
    }
  }, [authStore, router]);

  if (authStore.isLoading) return <div>Загрузка...</div>;

  return <>{children}</>;
});
