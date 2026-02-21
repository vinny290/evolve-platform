package com.misis.diplom.users_service.dto;

import java.util.UUID;

public record UserRegisteredEvent(
  UUID userId,
  String email
) {
}
