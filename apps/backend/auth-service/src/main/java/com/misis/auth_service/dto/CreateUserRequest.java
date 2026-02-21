package com.misis.auth_service.dto;

import java.util.UUID;

public record CreateUserRequest(
  UUID id,
  String email
) {
}
