package com.misis.auth_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.misis.auth_service.dto.*;
import com.misis.auth_service.exception.InvalidCredentialsException;
import com.misis.auth_service.model.AuthUser;
import com.misis.auth_service.model.OutboxEvent;
import com.misis.auth_service.model.OutboxStatus;
import com.misis.auth_service.model.RefreshToken;
import com.misis.auth_service.repository.AuthUserRepository;
import com.misis.auth_service.repository.OutboxRepository;
import com.misis.auth_service.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final AuthUserRepository authUserRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final OutboxRepository outboxRepository;
  private final ObjectMapper objectMapper;

  @Transactional
  public void register(RegisterRequest request) {
    AuthUser user = AuthUser.builder()
      .email(request.email())
      .passwordHash(passwordEncoder.encode(request.password()))
      .roles(Set.of("USER"))
      .build();

    authUserRepository.save(user);

    UserRegisterEvent event =
      new UserRegisterEvent(user.getId(), user.getEmail());

    try {
      outboxRepository.save(
        OutboxEvent.builder()
          .aggregateType("AuthUser")
          .aggregateId(user.getId())
          .eventType("USER_REGISTERED")
          .payload(objectMapper.writeValueAsString(event))
          .status(OutboxStatus.NEW)
          .build()
      );
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize event to JSON", e);
    }
  }

  @Transactional
  public TokenResponse login(LoginRequest request) {
    AuthUser user = authUserRepository.findByEmail(request.email())
      .orElseThrow(InvalidCredentialsException::new);

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new InvalidCredentialsException();
    }

    String access = jwtService.generateAccessToken(user);
    String refresh = jwtService.generateRefreshToken(user);

    refreshTokenRepository.save(
      RefreshToken.builder()
        .user(user)
        .token(refresh)
        .expiresAt(LocalDateTime.now().plusDays(30))
        .build()
    );

    return new TokenResponse(access, refresh);
  }

  @Transactional
  public TokenResponse refresh(RefreshRequest request) {

    RefreshToken stored = refreshTokenRepository.findByToken(request.refreshToken())
      .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

    if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Refresh token expired");
    }

    AuthUser user = stored.getUser();

    String newAccess = jwtService.generateAccessToken(user);
    String newRefresh = jwtService.generateRefreshToken(user);

    stored.setToken(newRefresh);
    stored.setExpiresAt(LocalDateTime.now().plusDays(30));

    return new TokenResponse(newAccess, newRefresh);
  }

}
