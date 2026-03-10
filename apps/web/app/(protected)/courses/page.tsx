"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { useRootStore } from "app/stores";
import { ProtectedRoute } from "components/ProtectedRoute";

import { Button } from "@/components/ui/button";

import CourseCard from "components/CourseCard";
import { Separator } from "@/components/ui/separator";
import Title from "components/Typography/Title";
import Link from "next/link";

const CoursesPage = observer(() => {
  const { courseStore } = useRootStore();

  useEffect(() => {
    courseStore.fetchCourses();
  }, []);

  if (courseStore.isLoading || !courseStore.courses) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <Title>Все курсы</Title>
        <Separator />
        {courseStore.isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {courseStore.error && (
          <div className="text-red-500 text-center">{courseStore.error}</div>
        )}

        {!courseStore.isLoading && courseStore.courses.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            Курсы пока не созданы
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10 py-10">
          {courseStore.courses.map((course) => (
            <Link key={course.id} href={`courses/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        <Title>Рекомендации</Title>
        <Separator />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-10">
          {courseStore.courses.map((course) => (
            <Link key={course.id} href={`courses/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        {courseStore.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            {Array.from({
              length: courseStore.totalPages,
            }).map((_, i) => (
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
