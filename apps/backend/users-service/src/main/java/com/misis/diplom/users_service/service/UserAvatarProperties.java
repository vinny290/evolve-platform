package com.misis.diplom.users_service.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@PropertySource("classpath:config.properties")
public class UserAvatarProperties {

  @Value("${app.user.default-avatar-url}")
  private String defaultAvatarUrl;
}
