package com.misis.diplom.users_service.mapper;

import com.misis.diplom.users_service.model.User;
import com.misis.diplom.users_service.dto.request.UserRequest;
import com.misis.diplom.users_service.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // старый метод без avatarUrl (можно оставить для внутреннего использования)
    @Mapping(target = "avatarUrl", ignore = true)
    UserResponse toResponse(User user);

    User toEntity(UserRequest request);
    
}