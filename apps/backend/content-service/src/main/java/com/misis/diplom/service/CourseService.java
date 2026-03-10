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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
  public Page<CourseResponse> getAllCoursesWithLikes(Pageable pageable, UUID userId) {

    Page<Course> courses = courseRepository.findAll(pageable);

    List<UUID> courseIds = courses.stream().map(Course::getId).toList();
    Map<UUID, UserCourseInteraction> interactions = userCourseInteractionRepository
        .findAllByUserIdAndCourseIdIn(userId, courseIds)
        .stream()
        .collect(Collectors.toMap(UserCourseInteraction::getCourseId, ui -> ui));

    return courses.map(course -> {
      boolean isLiked = interactions.getOrDefault(course.getId(), new UserCourseInteraction()).isLiked();
      CourseResponse base = courseMapper.toResponse(course);
      return new CourseResponse(
          base.id(),
          base.title(),
          base.description(),
          base.imageUrl(),
          base.levelEducation(),
          base.sphere(),
          base.views(),
          base.likes(),
          base.ratingsCount(),
          base.averageScore(),
          base.popularity(),
          isLiked);
    });
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
    // recalculatePopularity(course);

    CourseResponse response = courseMapper.toResponse(course);

    return new CourseResponse(
        response.id(),
        response.title(),
        response.description(),
        response.imageUrl(),
        response.levelEducation(),
        response.sphere(),
        response.views(),
        response.likes(),
        response.ratingsCount(),
        response.averageScore(),
        response.popularity(),
        interaction.isLiked());
  }

  @Transactional
  public CourseResponse createCourse(CourseCreateRequest request/* , MultipartFile file */) {
    Course course = courseMapper.toEntity(request);

    /*
     * String imageUrl;
     * 
     * if (file != null && !file.isEmpty()) {
     * String objectName = minioService.uploadFile(file);
     * imageUrl = minioService.getFileUrl(objectName);
     * } else {
     * imageUrl = courseImageProperties.getDefaultImageUrl();
     * }
     * 
     * course.setImageUrl(imageUrl);
     */

    // Начальные данные для мат модели
    course.setViews(0);
    course.setLikes(0);
    course.setRatingsCount(0);
    course.setAverageScore(0.0);

    Course savedCourse = courseRepository.save(course);

    return courseMapper.toResponse(savedCourse);
  }

  @Transactional
  public CourseResponse updateCourse(UUID courseId, CourseUpdateRequest request/* , MultipartFile file */) {
    Course updatedCourse = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));

    /*
     * if (file != null && !file.isEmpty()) {
     * String imageUrl = minioService.getFileUrl(minioService.uploadFile(file));
     * updatedCourse.setImageUrl(imageUrl);
     * }
     */

    if (request.title() != null)
      updatedCourse.setTitle(request.title());
    if (request.description() != null)
      updatedCourse.setDescription(request.description());
    if (request.levelEducation() != null)
      updatedCourse.setLevelEducation(request.levelEducation());
    if (request.sphere() != null)
      updatedCourse.setSphere(request.sphere());

    return courseMapper.toResponse(updatedCourse);
  }

  @Transactional
  public void deleteCourse(UUID courseId) {
    Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));

    /*
     * if (course.getImageUrl() != null) {
     * String filename = minioService.extractFilename(course.getImageUrl());
     * minioService.deleteFile(filename);
     * }
     */

    courseRepository.deleteById(courseId);
  }

  @Transactional
  public void addReview(UUID courseId, UUID userId, int score) {

    Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));

    UserCourseInteraction interaction = userCourseInteractionRepository.findByUserIdAndCourseId(userId, courseId)
        .orElseGet(() -> {
          UserCourseInteraction i = new UserCourseInteraction();
          i.setUserId(userId);
          i.setCourseId(courseId);
          return userCourseInteractionRepository.save(i);
        });

    interaction.setRating(score);

    courseStatisticsService.updateStatistics(course);
    // recalculatePopularity(course);

    courseRepository.save(course);
  }

  @Transactional
  public void addLike(UUID courseId, UUID userId) {

    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException(courseId));

    UserCourseInteraction interaction = userCourseInteractionRepository.findByUserIdAndCourseId(userId, courseId)
        .orElseGet(() -> {
          UserCourseInteraction i = new UserCourseInteraction();
          i.setUserId(userId);
          i.setCourseId(courseId);
          return userCourseInteractionRepository.save(i);
        });

    if (!interaction.isLiked()) {
      interaction.setLiked(true);
      course.setLikes(course.getLikes() + 1);
    } else {
      interaction.setLiked(false);
      course.setLikes(course.getLikes() - 1);
    }

    courseStatisticsService.updateStatistics(course);
    // recalculatePopularity(course);

    courseRepository.save(course);
  }
}
