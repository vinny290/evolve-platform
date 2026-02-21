package com.misis.diplom.users_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.misis.diplom.users_service.dto.UserRegisteredEvent;
import com.misis.diplom.users_service.model.User;
import com.misis.diplom.users_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {

  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;

  @KafkaListener(topics = "user.registered", groupId = "users-service")
  public void handleUserRegistered(String payload, Acknowledgment ack) {

    try {
      UserRegisteredEvent event = objectMapper.readValue(payload, UserRegisteredEvent.class);

      boolean isNewUser = !userRepository.existsById(event.userId());

      if (isNewUser) {
        User user = new User();
        user.setId(event.userId());
        user.setEmail(event.email());
        userRepository.save(user);
        log.info("User created successfully: id={}, email={}", event.userId(), event.email());
      } else {
        log.info("User already exists, skipping event: id={}, email={}", event.userId(), event.email());
      }

      ack.acknowledge();

    } catch (JsonProcessingException e) {
      log.error("Failed to deserialize user event payload: {}", payload, e);
    } catch (DataAccessException dbEx) {
      log.error("Database error while processing event payload: {}", payload, dbEx);
      throw dbEx;
    }
  }

}
