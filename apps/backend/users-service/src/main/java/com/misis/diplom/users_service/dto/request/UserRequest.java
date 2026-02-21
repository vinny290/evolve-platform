package com.misis.diplom.users_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(

  @NotBlank
  @Size(max = 30, min = 3)
  String firstName,

  @Size(max = 30, min = 3)
  String lastName,

  @NotBlank
  @Email
  @Size(max = 50)
  String email
) {
}
