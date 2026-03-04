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
import { Course, LevelEducationLabels } from "types/course";

const CourseCard = ({ id, title, description, levelEducation }: Course) => {
  const store = rootStore.courseStore;
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 hover:scale-110 transition cursor-pointer"
        onClick={(e) => {
          store.courseLike(id);
        }}
      >
        <Heart className="w-5 h-5" />
      </Button>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription>
          {LevelEducationLabels[levelEducation]}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
