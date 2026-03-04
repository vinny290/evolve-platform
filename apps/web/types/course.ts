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

export type Course = {
  id: string;
  title: string;
  description: string;
  levelEducation: LevelEducation;
  sphere?: string;
  views?: number;
  popularity?: number;
  likes?: number;
};
