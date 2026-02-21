package com.misis.auth_service.service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.misis.auth_service.dto.UserRegisterEvent;
import com.misis.auth_service.model.OutboxEvent;
import com.misis.auth_service.model.OutboxStatus;
import com.misis.auth_service.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

  private final OutboxRepository outboxRepository;
  private final KafkaTemplate<String, UserRegisterEvent> kafkaTemplate;
  private final ObjectMapper objectMapper;

  @Transactional
  @Scheduled(fixedDelay = 3000)
  public void publish() {
    var events = outboxRepository.findTop100ByStatus(OutboxStatus.NEW);
    log.info("Found {} new events to publish", events.size());

    for (OutboxEvent event : events) {
      publishEvent(event);
    }
  }

  private void publishEvent(OutboxEvent event) {
    try {
      // Преобразуем payload JSON в объект UserRegisterEvent
      UserRegisterEvent userEvent = objectMapper.readValue(event.getPayload(), UserRegisterEvent.class);

      // Отправляем объект в Kafka
      kafkaTemplate.send("user.registered", event.getAggregateId().toString(), userEvent).get();

      // Меняем статус только после успешной отправки
      event.setStatus(OutboxStatus.SENT);
      log.info("Event published successfully: id={}, aggregateId={}", event.getId(), event.getAggregateId());

    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      event.setStatus(OutboxStatus.FAILED);
      log.error("Thread interrupted while publishing event: id={}, aggregateId={}", event.getId(), event.getAggregateId(), e);

    } catch (ExecutionException | JsonProcessingException e) {
      event.setStatus(OutboxStatus.FAILED);
      log.error("Failed to publish event: id={}, aggregateId={}, cause={}", event.getId(), event.getAggregateId(), e.getMessage(), e);
    }
  }
}
