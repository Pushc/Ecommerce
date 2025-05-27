package com.pushkar.ecommerce.Controller;

import com.pushkar.ecommerce.Service.UserService;
import com.pushkar.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UserController {

    @Autowired
    private UserService userService;
    // This ensures only this origin is allowed
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered.");
        }
        user.setRole("USER");
        User savedUser = userService.registerUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully.");
    }
}
