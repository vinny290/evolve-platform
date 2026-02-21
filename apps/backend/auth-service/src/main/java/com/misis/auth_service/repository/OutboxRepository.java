package com.misis.auth_service.repository;

import com.misis.auth_service.model.OutboxEvent;
import com.misis.auth_service.model.OutboxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutboxRepository extends JpaRepository<OutboxEvent, UUID> {

  List<OutboxEvent> findTop100ByStatus(OutboxStatus status);
}
