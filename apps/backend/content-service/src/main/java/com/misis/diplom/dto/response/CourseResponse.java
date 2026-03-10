package com.misis.diplom.dto.response;

import java.util.UUID;

import com.misis.diplom.model.LevelEducation;

public record CourseResponse(
        UUID id,
        String title,
        String description,
        String imageUrl,
        LevelEducation levelEducation,
        String sphere,
        long views,
        long likes,
        long ratingsCount,
        double averageScore,
        double popularity,
        boolean isLiked) {
}
