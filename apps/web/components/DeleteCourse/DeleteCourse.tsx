import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { rootStore } from "app/stores";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

const DeleteCourse = observer(() => {
  const store = rootStore.courseStore;
  const router = useRouter();
  const handleSubmit = async () => {
    const success = await store.deleteCourse();

    if (success) {
      store.closeDeleteModal();
      router.push("/courses");
    }
  };
  return (
    <Dialog
      open={store.isDeleteModalOpen}
      onOpenChange={(open) => {
        if (!open) store.closeDeleteModal();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить курс?</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              store.closeDeleteModal();
            }}
            disabled={store.isCreating || store.isLoading}
            className="cursor-pointer"
          >
            {(store.isCreating || store.isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Отменить
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={store.isCreating || store.isLoading}
            className="cursor-pointer"
          >
            {(store.isCreating || store.isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default DeleteCourse;
