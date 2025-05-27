package com.pushkar.ecommerce.Controller;

import com.pushkar.ecommerce.Repository.ProductRepository;
import com.pushkar.ecommerce.Repository.UserRepository;
import com.pushkar.ecommerce.Service.OrderService;
import com.pushkar.ecommerce.Service.UserService;
import com.pushkar.ecommerce.dto.OrderDTO;
import com.pushkar.ecommerce.dto.OrderRequest;
import com.pushkar.ecommerce.dto.UserUpdateDTO;
import com.pushkar.ecommerce.entity.Product;
import com.pushkar.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Your frontend origin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // 🔹 Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔹 Delete user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent() && !"ADMIN".equals(user.get().getRole())) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot delete admin or user not found.");
    }

    // 🔹 Get all products
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    @GetMapping("/products/{p_id}")
    public ResponseEntity<?> getProductById(@PathVariable Long p_id) {
        try {
            Optional<Product> product = productRepository.findById(p_id);

            if (product.isPresent()) {
                return ResponseEntity.ok(product.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product not found with ID: " + p_id);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong while fetching the product.");
        }
    }

    @GetMapping("/users/{u_id}")
    public ResponseEntity<?> getUserById(@PathVariable Long u_id) {
        try {
            Optional<User> user = userRepository.findById(u_id);

            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found with ID: " + u_id);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong while fetching the user.");
        }
    }

    // update product by id
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Optional<Product> existingProductOpt = productRepository.findById(id);

        if (existingProductOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + id);
        }

        Product existingProduct = existingProductOpt.get();

        // Update fields
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setCategory(updatedProduct.getCategory());

        // Save updated product
        Product savedProduct = productRepository.save(existingProduct);

        return ResponseEntity.ok(savedProduct); // Optionally return the updated product
    }


    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userUpdateDTO) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
        }

        User existingUser = userOpt.get();

        // Update only editable fields
        existingUser.setName(userUpdateDTO.getUsername());
        existingUser.setEmail(userUpdateDTO.getEmail());

        // Optionally restrict updating sensitive fields like password or role
        User savedUser = userRepository.save(existingUser);

        return ResponseEntity.ok(savedUser); // Return updated user
    }


    // 🔹 Delete product by ID
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Product deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
    }

    // Add more admin-only actions here later
    // 🔹 Add new product
    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding product");
        }
    }


    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary() {
        long userCount = userRepository.count();
        long productCount = productRepository.count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("users", userCount);
        summary.put("products", productCount);

        return ResponseEntity.ok(summary);
    }

}

