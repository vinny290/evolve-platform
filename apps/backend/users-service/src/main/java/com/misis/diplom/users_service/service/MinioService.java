package com.misis.diplom.users_service.service;

import com.misis.diplom.users_service.exception.FileUploadException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MinioService {

  private final MinioClient minioClient;
  private final String bucket;

  public MinioService(@Value("${minio.url}") String url,
                      @Value("${minio.access-key}") String accessKey,
                      @Value("${minio.secret-key}") String secretKey,
                      @Value("${minio.bucket}") String bucket) {
    this.bucket = bucket;
    this.minioClient = MinioClient.builder()
      .endpoint(url)
      .credentials(accessKey, secretKey)
      .build();
  }

  public String uploadFile(MultipartFile file) {

    if (file == null || file.isEmpty()) {
      throw new FileUploadException("The file cannot be empty");
    }

    String filename = System.currentTimeMillis() + " " + file.getOriginalFilename();

    try (InputStream is = file.getInputStream()) {
      minioClient.putObject(
        PutObjectArgs.builder()
          .bucket(bucket)
          .object(filename)
          .stream(is, file.getSize(), -1)
          .contentType(file.getContentType())
          .build()
      );
    } catch (Exception e) {
      throw new FileUploadException("Failed to download file" + file.getOriginalFilename(), e);
    }

    return filename;
  }

  public String getFileUrl(String filename) {
    return "http://localhost:9000/" + bucket + "/" + filename;
  }

  public void deleteFile(String filename) {
    try {
      minioClient.removeObject(
        RemoveObjectArgs.builder()
          .bucket(bucket)
          .object(filename)
          .build()
      );
    } catch (Exception e) {
      throw new FileUploadException("Не удалось удалить файл " + filename, e);
    }
  }

  public String extractFilename(String url) {
    return url.substring(url.lastIndexOf("/") + 1);
  }
}
