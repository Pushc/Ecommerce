package com.pushkar.PaymentGateway.Service;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.pushkar.PaymentGateway.Entity.PaymentOrder;
import com.pushkar.PaymentGateway.Repository.PaymentRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Value("${razorpay.key_id}")
    private String key;

    @Value("${razorpay.secret_key_id}")
    private String secretKey;

    @Autowired
    private PaymentRepo paymentRepo;

    public String createOrder(PaymentOrder paymentOrder) throws RazorpayException {

        RazorpayClient razorpayClient = new RazorpayClient(key,secretKey);

        //json data
        JSONObject order = new JSONObject();

        order.put("amount",((int)paymentOrder.getAmount())*100); // paise
        order.put("currency","INR");
        order.put("receipt","txn_"+ UUID.randomUUID());

        Order razorpayOrder = razorpayClient.orders.create(order);
        paymentOrder.setOrderId(razorpayOrder.get("id"));
        paymentOrder.setStatus("CREATED");
        paymentOrder.setCreatedAt(LocalDateTime.now());

        paymentRepo.save(paymentOrder);

        return razorpayOrder.toString();

    }

    public double getTotalRevenue() {
        Double revenue = paymentRepo.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public long getSuccessfulOrderCount() {
        return paymentRepo.getSuccessfulOrderCount();
    }
}
