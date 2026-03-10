package com.misis.diplom.users_service.controller;

import com.misis.diplom.users_service.dto.request.UserRequest;
import com.misis.diplom.users_service.dto.response.UserResponse;
import com.misis.diplom.users_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  @GetMapping("{userId}")
  public UserResponse getUserById(@PathVariable UUID userId) {
    return userService.getUserById(userId);
  }

  @PostMapping(consumes = "multipart/form-data")
  public UserResponse createUser(
      @RequestPart("request") @Valid UserRequest request,
      @RequestPart(value = "file", required = false) MultipartFile file) {
    return userService.createUser(request, file);
  }

  @PatchMapping(value = "/{userId}", consumes = "multipart/form-data")
  public UserResponse updateUser(
      @PathVariable UUID userId,
      @RequestPart("request") UserRequest request,
      @RequestPart(value = "file", required = false) MultipartFile file) {
    return userService.updateUser(userId, request, file);
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
    userService.deleteUser(userId);

    return ResponseEntity.noContent().build();
  }
}
