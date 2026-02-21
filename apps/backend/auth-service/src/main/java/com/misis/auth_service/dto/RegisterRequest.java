package com.misis.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

  @NotBlank(message = "email is required")
  @Size(max = 255)
  @Email(message = "Invalid email format")
  String email,

  @NotBlank(message = "password is required")
  @Size(min = 7, max = 64)
  String password
) {
}
