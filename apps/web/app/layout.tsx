"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreProvider, useRootStore } from "./stores";
import "./globals.css";

const InitAuth = observer(({ children }: { children: React.ReactNode }) => {
  const { authStore } = useRootStore();

  useEffect(() => {
    authStore.initAuth?.(); // обязательно через store из useRootStore
  }, [authStore]);

  if (authStore.isLoading) return <div>Инициализация...</div>;

  return <>{children}</>;
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <InitAuth>{children}</InitAuth>
        </StoreProvider>
      </body>
    </html>
  );
}
