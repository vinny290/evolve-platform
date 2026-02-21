package com.misis.auth_service.controller;

import com.misis.auth_service.dto.LoginRequest;
import com.misis.auth_service.dto.RefreshRequest;
import com.misis.auth_service.dto.RegisterRequest;
import com.misis.auth_service.dto.TokenResponse;
import com.misis.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest request) {
    authService.register(request);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public TokenResponse login(@RequestBody @Valid LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/refresh")
  public TokenResponse refresh(@RequestBody @Valid RefreshRequest request) {
    return authService.refresh(request);
  }
}
