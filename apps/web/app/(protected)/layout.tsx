"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* ПРАВОЕ МЕНЮ */}
      <AppSidebar variant="inset" />

      {/* ЛЕВЫЙ КОНТЕНТ */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-4">
              <ProtectedRoute>{children}</ProtectedRoute>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
