package com.pushkar.ecommerce.Config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // Add a log to ensure the method is being called
        System.out.println("Adding CORS Configuration");

        registry.addMapping("/**") // Allow all endpoints
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500","https://pc-mart.netlify.app""https://pcc-mart.netlify.app") // Allowed frontend origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow cookies and authorization headers
    }
}
