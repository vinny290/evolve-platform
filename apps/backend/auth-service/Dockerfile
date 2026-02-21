# Build
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /auth-service
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /auth-service
RUN apk add --no-cache libc6-compat
COPY --from=builder /auth-service/target/auth-service-0.0.1.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
