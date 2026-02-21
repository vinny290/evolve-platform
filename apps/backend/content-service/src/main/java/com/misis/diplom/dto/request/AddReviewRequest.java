package com.misis.diplom.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record AddReviewRequest(

  @Max(5)
  @Min(1)
  int score
) {}
