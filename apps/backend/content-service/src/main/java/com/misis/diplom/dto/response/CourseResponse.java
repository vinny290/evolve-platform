package com.misis.diplom.dto.response;

import com.misis.diplom.model.LevelEducation;

public record CourseResponse(
  String title,
  String description,
  String imageUrl,
  LevelEducation levelEducation,
  String sphere,
  long views,
  long likes,
  long ratingsCount,
  double averageScore,
  double popularity
) {
}
