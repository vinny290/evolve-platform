package com.misis.diplom.mapper;

import com.misis.diplom.model.Course;
import com.misis.diplom.dto.request.CourseCreateRequest;
import com.misis.diplom.dto.request.CourseUpdateRequest;
import com.misis.diplom.dto.response.CourseResponse;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CourseMapper {

  CourseResponse toResponse(Course course);

  Course toEntity(CourseCreateRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateEntityFromRequest(CourseUpdateRequest request, @MappingTarget Course course);
}
