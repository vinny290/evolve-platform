"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { rootStore, StoreProvider } from "./stores";
import "./globals.css";
import { ThemeProvider } from "components/theme-provider";
import { Loader2 } from "lucide-react";

const InitAuth = observer(({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    rootStore.init();
  }, [rootStore]);

  if (rootStore.authStore.isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

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
          <InitAuth>
            <ThemeProvider>{children}</ThemeProvider>
          </InitAuth>
        </StoreProvider>
      </body>
    </html>
  );
}
