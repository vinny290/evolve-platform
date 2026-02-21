package com.misis.auth_service.service;

import com.misis.auth_service.model.AuthUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

  @Value("${jwt.access.secret}")
  private String accessSecret;

  @Value("${jwt.access.expiration}")
  private Long accessExpiration;

  @Value("${jwt.refresh.secret}")
  private String refreshSecret;

  @Value("${jwt.refresh.expiration}")
  private Long refreshExpiration;

  private SecretKey accessKey() {
    return Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
  }

  private SecretKey refreshKey() {
    return Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateAccessToken(AuthUser user) {
    return Jwts.builder()
      .setSubject(user.getId().toString())
      .claim("roles", user.getRoles())
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + accessExpiration))
      .signWith(accessKey(), SignatureAlgorithm.HS256)
      .compact();
  }

  public String generateRefreshToken(AuthUser user) {
    return Jwts.builder()
      .setSubject(user.getId().toString())
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
      .signWith(refreshKey(), SignatureAlgorithm.HS256)
      .compact();
  }

  public UUID parseRefreshToken(String token) {
    Claims claims = Jwts.parserBuilder()
      .setSigningKey(refreshKey())
      .build()
      .parseClaimsJws(token)
      .getBody();

    return UUID.fromString(claims.getSubject());
  }
}
