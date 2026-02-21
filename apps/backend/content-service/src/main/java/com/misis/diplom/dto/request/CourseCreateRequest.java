package com.misis.diplom.dto.request;

import com.misis.diplom.model.LevelEducation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record CourseCreateRequest(

  @NotBlank
  @Size(max = 100)
  String title,

  @Size(max = 2000)
  String description,

  @NotNull
  LevelEducation levelEducation,

  @NotBlank
  @Size(max = 50)
  String sphere
) {
}

