package com.misis.diplom.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@PropertySource("classpath:config.properties")
public class CourseImageProperties {

  @Value("${app.course.default-image-url}")
  private String defaultImageUrl;
}
