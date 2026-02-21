package com.misis.auth_service.dto;

import java.util.UUID;

public record UserRegisterEvent(
  UUID userId,
  String email
) {
}
