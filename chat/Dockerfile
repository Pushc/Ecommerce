# Stage 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Slim JDK runtime
FROM eclipse-temurin:21-jdk
WORKDIR /app
EXPOSE 8085

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
