"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { rootStore } from "app/stores";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default observer(function ProfilePage() {
  const store = rootStore.userStore;

  useEffect(() => {
    store.loadUser();
  }, []);

  if (!store.user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Загрузка профиля...
      </div>
    );
  }

  const initials =
    `${store.user.firstName?.[0] ?? ""}${store.user.lastName?.[0] ?? ""}` ||
    store.user.email[0].toUpperCase();

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Card className="shadow-lg rounded-2xl border-muted">
        <CardContent className="p-8 space-y-8">
          {/* Верхняя часть */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={store.user.avatarUrl} />
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              >
                Изменить
              </Button>
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                {store.user.firstName} {store.user.lastName}
              </h1>

              <p className="text-muted-foreground">{store.user.email}</p>
            </div>
          </div>

          {/* Информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Имя</p>
              <p className="font-medium">{store.user.firstName || "—"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Фамилия</p>
              <p className="font-medium">{store.user.lastName || "—"}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{store.user.email}</p>
            </div>
          </div>

          {/* Кнопка */}
          <div className="flex justify-end">
            <Button onClick={() => store.openEditModal()}>
              Редактировать профиль
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* МОДАЛКА */}
      <Dialog
        open={store.isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) store.closeEditModal();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              value={store.firstName}
              onChange={(e) => store.setFirstName(e.target.value)}
              placeholder="Имя"
            />

            <Input
              value={store.lastName}
              onChange={(e) => store.setLastName(e.target.value)}
              placeholder="Фамилия"
            />

            <Input
              value={store.email}
              onChange={(e) => store.setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          {store.error && (
            <div className="text-sm text-red-500 mt-3">{store.error}</div>
          )}

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              onClick={() => store.closeEditModal()}
              disabled={store.isLoading}
            >
              Отмена
            </Button>

            <Button
              onClick={() => store.updateUser()}
              disabled={store.isLoading}
            >
              {store.isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
