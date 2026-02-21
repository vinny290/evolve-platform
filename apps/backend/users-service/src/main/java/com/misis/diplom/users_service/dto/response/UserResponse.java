package com.misis.diplom.users_service.dto.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserResponse(
  @NotBlank
  @Size(max = 30, min = 3)
  String firstName,

  @Size(max = 30, min = 3)
  String lastName,

  @NotBlank
  @Email
  @Size(max = 50)
  String email,

  String avatarUrl
) {
}
