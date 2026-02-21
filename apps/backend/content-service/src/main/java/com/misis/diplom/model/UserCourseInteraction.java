package com.misis.diplom.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(
  name = "user_course_interactions",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "course_id"})
  }
)
public class UserCourseInteraction {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private UUID userId;

  private UUID courseId;

  private boolean viewed;

  private boolean liked;

  private Integer rating;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
