package com.pushkar.PaymentGateway.Controller;


import com.pushkar.PaymentGateway.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class PaymentStats {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/payment_details")
    public ResponseEntity<?> getPaymentSummary() {
        double revenue = paymentService.getTotalRevenue();
        long orderCount = paymentService.getSuccessfulOrderCount();

        Map<String, Object> summary = new HashMap<>();
        summary.put("orders", orderCount);
        summary.put("revenue", revenue);

        return ResponseEntity.ok(summary);
    }
}
