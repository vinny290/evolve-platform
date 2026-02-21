package com.misis.auth_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "auth_users")
public class AuthUser {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private String email;

  @Column(name = "password_hash")
  private String passwordHash;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
    name = "auth_user_roles",
    joinColumns = @JoinColumn(name = "user_id")
  )
  @Column(name = "role")
  private Set<String> roles;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @Version
  private long version;
}
