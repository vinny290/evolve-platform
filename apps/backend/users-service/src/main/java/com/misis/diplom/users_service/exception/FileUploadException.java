package com.misis.diplom.users_service.exception;

public class FileUploadException extends RuntimeException {
  public FileUploadException(String message) {
    super();
  }

  public FileUploadException(String message, Throwable cause) {
    super(message, cause);
  }
}
