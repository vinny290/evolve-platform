import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { rootStore } from "app/stores";
import { Heart } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Course, LevelEducation, LevelEducationLabels } from "types/course";

const CourseCard = observer(({ course }: { course: Course }) => {
  const store = rootStore.courseStore;
  const isLoading = store.loadingLikes.get(course.id) || false;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    store.courseLike(course.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 hover:scale-110 transition cursor-pointer"
        onClick={handleLike}
        disabled={isLoading}
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
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription>
          {LevelEducationLabels[course.levelEducation as LevelEducation]}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>
      </CardContent>
    </Card>
  );
});

export default CourseCard;
