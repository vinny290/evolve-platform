"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRootStore } from "app/stores";
import { ProtectedRoute } from "components/ProtectedRoute";

const CoursesPage = observer(() => {
  const { courseStore } = useRootStore();

  useEffect(() => {
    courseStore.fetchCourses();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 space-y-8">
        {/* CREATE COURSE */}
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Создать курс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название курса"
              value={courseStore.title}
              onChange={(e) => courseStore.setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Описание курса"
              value={courseStore.description}
              onChange={(e) => courseStore.setDescription(e.target.value)}
            />

            <Button
              onClick={() => courseStore.createCourse()}
              disabled={courseStore.isCreating}
              className="w-full"
            >
              {courseStore.isCreating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Создать
            </Button>
          </CardContent>
        </Card>

        {/* COURSES LIST */}
        <div className="space-y-4">
          {courseStore.isLoading && (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {courseStore.error && (
            <div className="text-red-500">{courseStore.error}</div>
          )}

          {courseStore.courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PAGINATION */}
        {courseStore.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: courseStore.totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={i === courseStore.page ? "default" : "outline"}
                onClick={() => courseStore.fetchCourses(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
});

export default CoursesPage;
