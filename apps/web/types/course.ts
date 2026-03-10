export enum LevelEducation {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export const LevelEducationLabels: Record<LevelEducation, string> = {
  [LevelEducation.BEGINNER]: "Начальный",
  [LevelEducation.INTERMEDIATE]: "Средний",
  [LevelEducation.ADVANCED]: "Продвинутый",
};

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  levelEducation: LevelEducation;
  sphere?: string;

  views: number;
  likes: number;
  ratingsCount: number;
  averageScore: number;
  popularity: number;

  isLiked: boolean;
}
