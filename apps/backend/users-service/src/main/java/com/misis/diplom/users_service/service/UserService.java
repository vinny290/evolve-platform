package com.misis.diplom.users_service.service;

import com.misis.diplom.users_service.exception.UserNotFoundException;
import com.misis.diplom.users_service.mapper.UserMapper;
import com.misis.diplom.users_service.model.User;
import com.misis.diplom.users_service.dto.request.UserRequest;
import com.misis.diplom.users_service.dto.response.UserResponse;
import com.misis.diplom.users_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final MinioService minioService;
  private final UserAvatarProperties userAvatarProperties;

  @Transactional
  public UserResponse getUserById(UUID userId) {
    User user = userRepository.findById(userId).orElseThrow(() ->
      new UserNotFoundException(userId));

    return userMapper.toResponse(user);
  }

  @Transactional
  public UserResponse createUser(UserRequest request/*, MultipartFile file*/) {
    User user = userMapper.toEntity(request);

    String avatarUrl;

    /* if (file != null && !file.isEmpty()) {
      String objectName = minioService.uploadFile(file);
      avatarUrl = minioService.getFileUrl(objectName);
    } else {
      avatarUrl = userAvatarProperties.getDefaultAvatarUrl();
    }

    user.setAvatarUrl(avatarUrl); */

    User savedUser = userRepository.save(user);

    return userMapper.toResponse(savedUser);
  }

  @Transactional
  public UserResponse updateUser(UUID userId, UserRequest request/*, MultipartFile file*/) {
    User updatedUser = userRepository.findById(userId).orElseThrow(() ->
      new UserNotFoundException(userId));

    /* if (file != null && !file.isEmpty()) {
      String avatarUrl = minioService.getFileUrl(minioService.uploadFile(file));
      updatedUser.setAvatarUrl(avatarUrl);
    } */
    if(request.firstName() != null) updatedUser.setFirstName(request.firstName());
    if(request.lastName() != null) updatedUser.setLastName(request.lastName());
    if(request.email() != null) updatedUser.setEmail(request.email());

    return userMapper.toResponse(updatedUser);
  }

  @Transactional
  public void deleteUser(UUID userId) {
    User deletedUser = userRepository.findById(userId).orElseThrow(() ->
      new UserNotFoundException(userId));

    /* if (deletedUser.getAvatarUrl() != null) {
      String filename =minioService.extractFilename(deletedUser.getAvatarUrl());
      minioService.deleteFile(filename);
    } */

    userRepository.deleteById(userId);
  }
}
