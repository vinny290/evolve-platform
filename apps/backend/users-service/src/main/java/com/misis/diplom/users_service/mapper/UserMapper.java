package com.misis.diplom.users_service.mapper;

import com.misis.diplom.users_service.model.User;
import com.misis.diplom.users_service.dto.request.UserRequest;
import com.misis.diplom.users_service.dto.response.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserResponse toResponse(User user);

  User toEntity(UserRequest request);
}
