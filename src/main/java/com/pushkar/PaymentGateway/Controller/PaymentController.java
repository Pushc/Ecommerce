package com.pushkar.PaymentGateway.Controller;


import com.pushkar.PaymentGateway.Entity.PaymentOrder;
import com.pushkar.PaymentGateway.Repository.PaymentRepo;
import com.pushkar.PaymentGateway.Service.PaymentService;
import com.pushkar.PaymentGateway.Service.UpdateOrderService;
import com.pushkar.PaymentGateway.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UpdateOrderService updateOrderService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PaymentRepo paymentRepo;

    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody PaymentOrder paymentOrder)
    {
        try {
            String order = paymentService.createOrder(paymentOrder);
            return ResponseEntity.ok(order);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Creating Order");
        }
    }

    @PostMapping("/updateOrder")
    public ResponseEntity<String> updateOrder(@RequestParam String payment_id,@RequestParam String order_id,@RequestParam String status,@RequestParam(required = false) String items)
    {
        updateOrderService.updateOrder(payment_id, order_id, status,items);
        System.out.println("Email sent successfully");

        return ResponseEntity.ok("Order Updated successfully and Email sent ");
    }


    @GetMapping("/user-orders")
    public ResponseEntity<?> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            String email = jwtUtil.extractEmail(token);
            List<PaymentOrder> orders = paymentRepo.findByEmail(email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching orders");
        }
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            String role = jwtUtil.extractRole(token);
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can view all orders.");
            }

            List<PaymentOrder> allOrders = paymentRepo.findAll();
            return ResponseEntity.ok(allOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching all orders");
        }
    }

}
//    Both methods return a ResponseEntity<String>, which allows you to customize the HTTP response.