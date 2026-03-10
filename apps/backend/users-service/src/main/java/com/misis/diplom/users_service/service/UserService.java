package com.misis.diplom.users_service.service;

import com.misis.diplom.users_service.dto.request.UserRequest;
import com.misis.diplom.users_service.dto.response.UserResponse;
import com.misis.diplom.users_service.exception.UserNotFoundException;
import com.misis.diplom.users_service.mapper.UserMapper;
import com.misis.diplom.users_service.model.User;
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

@Transactional(readOnly = true)
public UserResponse getUserById(UUID userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

String avatarUrl = (user.getAvatarFilename() != null)
        ? minioService.getPresignedUrl(user.getAvatarFilename())
        : userAvatarProperties.getDefaultAvatarUrl();

return new UserResponse(
    user.getFirstName(),
    user.getLastName(),
    user.getEmail(),
    avatarUrl
);
}

@Transactional
public UserResponse createUser(UserRequest request, MultipartFile file) {

    User user = userMapper.toEntity(request);

    if (file != null && !file.isEmpty()) {
        String filename = minioService.uploadFile(file);
        user.setAvatarFilename(filename);
    }

    User savedUser = userRepository.save(user);

String avatarUrl = savedUser.getAvatarFilename() != null
        ? minioService.getPresignedUrl(savedUser.getAvatarFilename())
        : userAvatarProperties.getDefaultAvatarUrl();

return new UserResponse(
    savedUser.getFirstName(),
    savedUser.getLastName(),
    savedUser.getEmail(),
    avatarUrl
);
}

@Transactional
public UserResponse updateUser(UUID userId, UserRequest request, MultipartFile file) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

    if (file != null && !file.isEmpty()) {
        if (user.getAvatarFilename() != null) {
            minioService.deleteFile(user.getAvatarFilename());
        }
        String filename = minioService.uploadFile(file);
        user.setAvatarFilename(filename);
    }

    if (request.firstName() != null) user.setFirstName(request.firstName());
    if (request.lastName() != null) user.setLastName(request.lastName());
    if (request.email() != null) user.setEmail(request.email());

    User savedUser = userRepository.save(user);

String avatarUrl = savedUser.getAvatarFilename() != null
        ? minioService.getPresignedUrl(savedUser.getAvatarFilename())
        : userAvatarProperties.getDefaultAvatarUrl();

return new UserResponse(
    savedUser.getFirstName(),
    savedUser.getLastName(),
    savedUser.getEmail(),
    avatarUrl
);
}

  @Transactional
  public void deleteUser(UUID userId) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));

    if (user.getAvatarFilename() != null) {
      minioService.deleteFile(user.getAvatarFilename());
    }

    userRepository.delete(user);
  }
}