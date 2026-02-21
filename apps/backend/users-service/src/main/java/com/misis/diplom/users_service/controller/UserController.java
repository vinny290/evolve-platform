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

  @PostMapping
  public UserResponse createUser(@RequestBody @Valid UserRequest request/*,
                                 @RequestPart("file")MultipartFile file*/) {
    //return userService.createUser(request, file);
    return userService.createUser(request);
  }

  @PatchMapping("/{userId}")
  public UserResponse updateUser(@PathVariable UUID userId,
                                 @RequestBody UserRequest request/*,
                                 @RequestPart("file") MultipartFile file*/) {
    //return userService.updateUser(userId, request, file);
    return userService.updateUser(userId, request);
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
    userService.deleteUser(userId);

    return ResponseEntity.noContent().build();
  }
}
