package com.misis.diplom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CourseNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleCourseNotFound(CourseNotFoundException ex) {
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        ex.getMessage()
      ));
  }

  public ResponseEntity<ErrorResponse> handleFileUpload(FileUploadException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        ex.getMessage()
        ));
  }
}
