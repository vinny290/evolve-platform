package com.misis.diplom.service;

import com.misis.diplom.model.Course;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

@Service
@PropertySource("classpath:config.properties")
public class CoursePopularityService {

  @Value("${calculation.alpha}")
  private double ALPHA;

  @Value("${calculation.beta}")
  private double BETA;

  @Value("${calculation.gamma}")
  private double GAMMA;

  public double calculatePopularity(Course course) {
    return Math.log(ALPHA * course.getViews() + 1)
      + BETA * course.getLikes()
      + GAMMA * course.getAverageScore() * course.getRatingsCount();
  }


}
