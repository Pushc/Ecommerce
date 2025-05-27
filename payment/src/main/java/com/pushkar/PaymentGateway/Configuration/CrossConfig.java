package com.pushkar.PaymentGateway.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CrossConfig {

    @Bean
    public WebMvcConfigurer config()
    {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**").allowedOrigins("http://127.0.0.1:5500","http://localhost:5500","https://pc-mart.netlify.app").allowedMethods("POST","GET","PUT","DELETE","PATCH","OPTIONS").allowedHeaders("*").allowCredentials(true);

                registry.addMapping("/admin/**").allowedOrigins("http://127.0.0.1:5500","http://localhost:5500","https://pc-mart.netlify.app").allowedMethods("POST","GET","PUT","DELETE","PATCH","OPTIONS").allowedHeaders("*").allowCredentials(true);
            }
        };
    }
}
