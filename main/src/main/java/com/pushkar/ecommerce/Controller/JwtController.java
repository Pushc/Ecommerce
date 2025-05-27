package com.pushkar.ecommerce.Controller;

import com.pushkar.ecommerce.Repository.UserRepository;
import com.pushkar.ecommerce.Util.JwtUtil;
import com.pushkar.ecommerce.dto.LoginRequest;
import com.pushkar.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/login")
public class JwtController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/generate-token")
    public ResponseEntity<String> generateToken(@RequestBody LoginRequest loginRequest) {
        // Step 1: Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        // Step 2: If user exists, compare the hashed password
        return userOptional
                .filter(user -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) // Compare hashed password
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail(),
                            user.getRole()
                    );
                    return ResponseEntity.ok(token);  // Return the token in a structured response
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials"));
    }

    @GetMapping("/validate")
    public String validateToken(@RequestHeader(value = "Authorization",required = false)String authorizationHeader)
    {
        if(authorizationHeader!=null && authorizationHeader.startsWith("Bearer "))
        {
            String token = authorizationHeader.substring(7).trim();
            if(jwtUtil.validateToken(token))
            {
                return "This is secure API , token Valid";
            }
            else {
                return "Invalid Token";
            }
        }
        else
        {
            return "Authorization Header is Missing  ";
        }
    }
}

