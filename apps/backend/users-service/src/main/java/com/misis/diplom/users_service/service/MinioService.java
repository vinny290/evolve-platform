package com.misis.diplom.users_service.service;

import com.misis.diplom.users_service.exception.FileUploadException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class MinioService {

  private final MinioClient minioClient;
  private final MinioClient publicClient;
  private final String bucket;
  private final String publicBaseUrl;

  public MinioService(
      @Value("${minio.internal-url}") String internalUrl,
      @Value("${minio.public-url}") String publicUrl,
      @Value("${minio.access-key}") String accessKey,
      @Value("${minio.secret-key}") String secretKey,
      @Value("${minio.bucket}") String bucket) {
    this.bucket = bucket;
    this.publicBaseUrl = publicUrl;
    this.minioClient = MinioClient.builder()
        .endpoint(internalUrl)
        .credentials(accessKey, secretKey)
        .build();
    this.publicClient = null;
  }

  // Загружает файл и возвращает безопасное имя
  public String uploadFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new FileUploadException("Файл не может быть пустым");
    }

    // безопасное имя: UUID + расширение
    String originalName = file.getOriginalFilename();
    String ext = originalName != null && originalName.contains(".")
        ? originalName.substring(originalName.lastIndexOf("."))
        : "";
    String filename = UUID.randomUUID() + ext;

    try (InputStream is = file.getInputStream()) {
      minioClient.putObject(
          PutObjectArgs.builder()
              .bucket(bucket)
              .object(filename)
              .stream(is, file.getSize(), -1)
              .contentType(file.getContentType())
              .build());
    } catch (Exception e) {
      throw new FileUploadException("Не удалось загрузить файл: " + originalName, e);
    }

    return filename;
  }

  // Генерирует presigned URL для просмотра
  public String getPresignedUrl(String filename) {
    // Проще и надёжнее: формируем обычный публичный URL, как в content-service.
    // MinIO доступен по publicBaseUrl (например, http://localhost:9000) с открытым доступом к bucket.
    return publicBaseUrl + "/" + bucket + "/" + filename;
  }

  // Удаляет файл из MinIO
  public void deleteFile(String filename) {
    try {
      minioClient.removeObject(
          RemoveObjectArgs.builder()
              .bucket(bucket)
              .object(filename)
              .build());
    } catch (Exception e) {
      throw new FileUploadException("Не удалось удалить файл: " + filename, e);
    }
  }

  // Извлекает имя файла из полного URL (для удаления старого)
  public String extractFilename(String url) {
    if (url == null)
      return null;
    return url.substring(url.lastIndexOf("/") + 1);
  }
}