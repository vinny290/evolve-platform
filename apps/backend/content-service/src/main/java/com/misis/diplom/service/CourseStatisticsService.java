package com.misis.diplom.service;

import com.misis.diplom.model.Course;
import com.misis.diplom.repository.UserCourseInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseStatisticsService {

  private final UserCourseInteractionRepository userCourseInteractionRepository;

  public void updateStatistics(Course course) {
    UUID courseId = course.getId();

    long views = userCourseInteractionRepository.countByCourseIdAndViewedTrue(courseId);
    long likes = userCourseInteractionRepository.countByCourseIdAndLikedTrue(courseId);
    long ratingCount = userCourseInteractionRepository.countByCourseIdAndRatingIsNotNull(courseId);
    Double avg = userCourseInteractionRepository.findAverageRatingByCourseId(courseId);

    course.setViews(views);
    course.setLikes(likes);
    course.setRatingsCount(ratingCount);
    course.setAverageScore(avg != null ? avg : 0.0);
  }
}
