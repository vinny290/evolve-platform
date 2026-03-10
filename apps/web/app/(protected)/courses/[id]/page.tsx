"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { rootStore } from "app/stores";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

import CourseModal from "components/CourseModal";
import DeleteCourse from "components/DeleteCourse/DeleteCourse";

export default observer(function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const store = rootStore.courseStore;

  useEffect(() => {
    if (id) {
      store.getCourseById(id);
    }
  }, [id]);

  if (store.isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!store.course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Курс не найден
      </div>
    );
  }

  const course = store.course;
  const isLiking = store.loadingLikes.get(course.id) || false;
  console.log("liked: ", course.isLiked);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Card className="shadow-lg rounded-2xl relative">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 hover:scale-110 transition cursor-pointer"
          onClick={() => store.courseLike(course.id)}
          disabled={isLiking}
        >
          <Heart
            className={`w-5 h-5 ${
              course.isLiked
                ? "fill-red-500 text-red-500"
                : "fill-none text-gray-500"
            }`}
          />
        </Button>

        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-3 flex-wrap">
            <Badge variant="secondary">{course.levelEducation}</Badge>
            {course.sphere && <Badge variant="outline">{course.sphere}</Badge>}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
            <div>
              <p className="text-muted-foreground">Просмотры</p>
              <p className="font-semibold">{course.views ?? 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Лайки</p>
              <p className="font-semibold">{course.likes ?? 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Популярность</p>
              <p className="font-semibold">{course.popularity?.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="cursor-pointer"
              onClick={() => store.startEdit(course)}
            >
              Редактировать
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => store.startDelete(course)}
            >
              Удалить
            </Button>
          </div>
        </CardContent>
      </Card>

      <CourseModal />
      <DeleteCourse />
    </div>
  );
});
