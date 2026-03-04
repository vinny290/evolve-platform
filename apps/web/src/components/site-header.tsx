"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "components/theme-toggle";
import { rootStore } from "../../app/stores/index";
import { Plus } from "lucide-react";
import CourseModal from "components/CourseModal";

const routeTitles: Record<string, string> = {
  "/courses": "Курсы",
  "/profile": "Аккаунт",
};

export function SiteHeader() {
  const pathname = usePathname();

  const title = routeTitles[pathname] || "Auth"; // fallback если маршрут не найден

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          {title === "Курсы" ? (
            <Button
              className="cursor-pointer"
              onClick={() => rootStore.courseStore.startCreate()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Создать курс
            </Button>
          ) : null}
          <ThemeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
        <CourseModal />
      </div>
    </header>
  );
}
