package com.misis.diplom.service;

import com.misis.diplom.exception.CourseNotFoundException;
import com.misis.diplom.model.Course;
import com.misis.diplom.dto.request.CourseCreateRequest;
import com.misis.diplom.dto.request.CourseUpdateRequest;
import com.misis.diplom.dto.response.CourseResponse;
import com.misis.diplom.mapper.CourseMapper;
import com.misis.diplom.model.UserCourseInteraction;
import com.misis.diplom.repository.CourseRepository;
import com.misis.diplom.repository.UserCourseInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository courseRepository;
  private final CourseMapper courseMapper;
  private final MinioService minioService;
  private final CoursePopularityService popularityService;
  private final CourseImageProperties courseImageProperties;
  private final UserCourseInteractionRepository userCourseInteractionRepository;
  private final CourseStatisticsService courseStatisticsService;

  @Transactional(readOnly = true)
  public Page<CourseResponse> getAllCourse(Pageable pageable) {
    return courseRepository.findAll(pageable).map(courseMapper::toResponse);
  }

  @Transactional
  public CourseResponse getCourseById(UUID courseId, UUID userId) {

    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new CourseNotFoundException(courseId));

    UserCourseInteraction interaction = userCourseInteractionRepository
      .findByUserIdAndCourseId(userId, courseId).orElseGet(() -> {
        UserCourseInteraction i = new UserCourseInteraction();
        i.setUserId(userId);
        i.setCourseId(courseId);
        return userCourseInteractionRepository.save(i);
      });

    if (!interaction.isViewed()) {
      interaction.setViewed(true);
    }

    courseStatisticsService.updateStatistics(course);
    recalculatePopularity(course);

    return courseMapper.toResponse(course);
  }

  @Transactional
  public CourseResponse createCourse(CourseCreateRequest request/*, MultipartFile file*/) {
    Course course = courseMapper.toEntity(request);

    /* String imageUrl;

    if (file != null && !file.isEmpty()) {
      String objectName = minioService.uploadFile(file);
      imageUrl = minioService.getFileUrl(objectName);
    } else {
      imageUrl = courseImageProperties.getDefaultImageUrl();
    }

    course.setImageUrl(imageUrl); */

    // Начальные данные для мат модели
    course.setViews(0);
    course.setLikes(0);
    course.setRatingsCount(0);
    course.setAverageScore(0.0);

    Course savedCourse = courseRepository.save(course);

    return courseMapper.toResponse(savedCourse);
  }

  @Transactional
  public CourseResponse updateCourse(UUID courseId, CourseUpdateRequest request/*, MultipartFile file*/) {
    Course updatedCourse = courseRepository.findById(courseId).orElseThrow(()
      -> new CourseNotFoundException(courseId));

    /*if (file != null && !file.isEmpty()) {
      String imageUrl = minioService.getFileUrl(minioService.uploadFile(file));
      updatedCourse.setImageUrl(imageUrl);
    }*/

    if (request.title() != null) updatedCourse.setTitle(request.title());
    if (request.description() != null) updatedCourse.setDescription(request.description());
    if (request.levelEducation() != null) updatedCourse.setLevelEducation(request.levelEducation());
    if (request.sphere() != null) updatedCourse.setSphere(request.sphere());

    return courseMapper.toResponse(updatedCourse);
  }

  @Transactional
  public void deleteCourse(UUID courseId) {
    Course course = courseRepository.findById(courseId).orElseThrow(()
      -> new CourseNotFoundException(courseId));

    /*if (course.getImageUrl() != null) {
      String filename = minioService.extractFilename(course.getImageUrl());
      minioService.deleteFile(filename);
    } */

    courseRepository.deleteById(courseId);
  }

  @Transactional
  public void addReview(UUID courseId, UUID userId, int score) {

    Course course = courseRepository.findById(courseId).orElseThrow(()
      -> new CourseNotFoundException(courseId));

    UserCourseInteraction interaction = userCourseInteractionRepository.findByUserIdAndCourseId(userId, courseId)
        .orElseGet(() -> {
          UserCourseInteraction i = new UserCourseInteraction();
          i.setUserId(userId);
          i.setCourseId(courseId);
          return userCourseInteractionRepository.save(i);
        });

    interaction.setRating(score);

    courseStatisticsService.updateStatistics(course);
    recalculatePopularity(course);

    courseRepository.save(course);
  }

  @Transactional
  public void addLike(UUID courseId, UUID userId) {

    Course course = courseRepository.findById(courseId).orElseThrow(()
      -> new CourseNotFoundException(courseId));

    UserCourseInteraction interaction = userCourseInteractionRepository.findByUserIdAndCourseId(userId, courseId)
      .orElseGet(() -> {
        UserCourseInteraction i = new UserCourseInteraction();
        i.setUserId(userId);
        i.setCourseId(courseId);
        return userCourseInteractionRepository.save(i);
      });

    if (!interaction.isLiked()) {
      interaction.setLiked(true);
    }

    courseStatisticsService.updateStatistics(course);
    recalculatePopularity(course);
  }

  private void recalculatePopularity(Course course) {
    double popularity = popularityService.calculatePopularity(course);
    course.setPopularity(popularity);
  }
}
