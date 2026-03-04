"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { rootStore } from "app/stores";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { LevelEducation, LevelEducationLabels } from "types/course";

const CourseModal = observer(() => {
  const store = rootStore.courseStore;

  const handleSubmit = async () => {
    if (store.isEditing) {
      await store.updateCourse();
    } else {
      await store.createCourse();
    }
  };

  return (
    <Dialog
      open={store.isEditModalOpen}
      onOpenChange={(open) => {
        if (!open) store.closeModal();
      }}
    >
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>
            {store.isEditing ? "Редактирование курса" : "Создание курса"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Название курса"
            value={store.title}
            onChange={(e) => store.setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Описание курса"
            value={store.description}
            onChange={(e) => store.setDescription(e.target.value)}
          />

          <div className="flex gap-4">
            <Select
              value={store.levelEducation}
              onValueChange={(value) =>
                store.setLevelEducation(value as LevelEducation)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Уровень" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(LevelEducation).map((level) => (
                  <SelectItem key={level} value={level}>
                    {LevelEducationLabels[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Сфера"
              value={store.sphere}
              onChange={(e) => store.setSphere(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={store.isCreating || store.isLoading}
            className="w-full cursor-pointer"
          >
            {(store.isCreating || store.isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {store.isEditing ? "Сохранить изменения" : "Создать курс"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CourseModal;
