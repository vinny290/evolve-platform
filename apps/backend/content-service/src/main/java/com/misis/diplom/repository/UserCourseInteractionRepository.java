package com.misis.diplom.repository;

import com.misis.diplom.model.UserCourseInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCourseInteractionRepository extends JpaRepository<UserCourseInteraction, UUID> {

  Optional<UserCourseInteraction> findByUserIdAndCourseId(UUID userId, UUID courseId);

  long countByCourseIdAndViewedTrue(UUID courseId);

  long countByCourseIdAndLikedTrue(UUID courseId);

  long countByCourseIdAndRatingIsNotNull(UUID courseId);

  @Query("""
  select avg(i.rating)
  from UserCourseInteraction i
  where i.courseId = :courseId
    and i.rating is not null
  """)
  Double findAverageRatingByCourseId(UUID courseId);

}
