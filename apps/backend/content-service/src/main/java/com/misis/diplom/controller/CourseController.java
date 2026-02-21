package com.misis.diplom.controller;

import com.misis.diplom.dto.request.AddReviewRequest;
import com.misis.diplom.dto.request.CourseCreateRequest;
import com.misis.diplom.dto.request.CourseUpdateRequest;
import com.misis.diplom.dto.response.CourseResponse;
import com.misis.diplom.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/course")
public class CourseController {

  private final CourseService courseService;

  @GetMapping
  public Page<CourseResponse> getAllCourses(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
    return courseService.getAllCourse(pageable);
  }

  @GetMapping("/{courseId}")
  public CourseResponse getCourseById(@PathVariable UUID courseId, @AuthenticationPrincipal Jwt jwt) {
    UUID userId = extractUserId(jwt);
    return courseService.getCourseById(courseId, userId);
  }

  @PostMapping
  public CourseResponse createCourse(@RequestBody @Valid CourseCreateRequest request/*,
                                     @RequestPart("file") MultipartFile file*/) {
    //return courseService.createCourse(request, file);
    return courseService.createCourse(request);
  }

  @PatchMapping("/{courseId}")
  public CourseResponse updateCourse(@PathVariable UUID courseId,
                                     @RequestBody @Valid CourseUpdateRequest request/*,
                                     @RequestPart("file") MultipartFile file*/) {
    //return courseService.updateCourse(courseId, request, file);
    return courseService.updateCourse(courseId, request);
  }

  @DeleteMapping("/{courseId}")
  public ResponseEntity<Void> deleteCourse(@PathVariable UUID courseId) {
    courseService.deleteCourse(courseId);

    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{courseId}/reviews")
  public ResponseEntity<Void> addReview(@PathVariable UUID courseId,
                                        @AuthenticationPrincipal Jwt jwt,
                                        @RequestBody @Valid AddReviewRequest request) {
    UUID userId = extractUserId(jwt);
    courseService.addReview(courseId, userId, request.score());

    return ResponseEntity.ok().build();
  }

  @PatchMapping("/{courseId}/likes")
  public ResponseEntity<Void> addLike(@PathVariable UUID courseId, @AuthenticationPrincipal Jwt jwt) {
    UUID userId = extractUserId(jwt);
    courseService.addLike(courseId, userId);

    return ResponseEntity.ok().build();
  }

  private UUID extractUserId(Jwt jwt) {
    return UUID.fromString(jwt.getSubject());
  }
}
