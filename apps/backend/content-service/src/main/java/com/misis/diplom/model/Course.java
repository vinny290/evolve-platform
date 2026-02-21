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
@Getter
@Setter
@NoArgsConstructor
@Table(name = "courses")
public class Course {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  private String title;

  private String description;

  private String imageUrl;

  @Enumerated(EnumType.STRING)
  private LevelEducation levelEducation;

  private String sphere;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @Version
  private long version;

  // --- Поля для математической модели ---

  // Просмотры
  private long views;

  // Лайки
  private long likes;

  // Кол-во оценок
  private long ratingsCount;

  // Средняя оценка
  private double averageScore;

  // Результат модели
  private double popularity;
}
