package com.pushkar.PaymentGateway.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pushkar.PaymentGateway.DTO.CartItemDto;
import com.pushkar.PaymentGateway.Entity.PaymentOrder;
import com.pushkar.PaymentGateway.Repository.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateOrderService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private EmailService emailService;

    // ✅ Autowire WhatsAppService
    @Autowired
    private WhatsAppService whatsAppService;

    public void updateOrder(String paymentId, String orderId, String status, String itemsJson) {
        PaymentOrder byOrderId = paymentRepo.findByOrderId(orderId);
        byOrderId.setPaymentId(paymentId);
        byOrderId.setStatus(status);
        paymentRepo.save(byOrderId);

        if ("SUCCESS".equalsIgnoreCase(status) && itemsJson != null) {
            try {
                // ✅ Parse items JSON to List<CartItemDto>
                ObjectMapper mapper = new ObjectMapper();
                List<CartItemDto> items = mapper.readValue(itemsJson, new TypeReference<>() {});

                // ✅ Send email with invoice attachment
                emailService.sendEmailWithItems(
                        byOrderId.getEmail(),
                        byOrderId.getName(),
                        byOrderId.getAddress(),
                        byOrderId.getAmount(),
                        items,
                        orderId
                );

                // ✅ Build WhatsApp message
                StringBuilder message = new StringBuilder();
                message.append("✅ *Order Confirmed!* \n")
                        .append("Order ID: ").append(orderId).append("\n")
                        .append("Name: ").append(byOrderId.getName()).append("\n\n")
                        .append("🛍️ Items:\n");

                double subtotal = 0;

                for (CartItemDto item : items) {
                    double itemSubtotal = item.getPrice() * item.getQuantity();
                    subtotal += itemSubtotal;
                    message.append("- ")
                            .append(item.getName())
                            .append(" x").append(item.getQuantity())
                            .append(" = ₹").append(String.format("%.2f", itemSubtotal)).append("\n");
                }

                double gst = subtotal * 0.18;
                double total = subtotal + gst;

                message.append("\nSubtotal: ₹").append(String.format("%.2f", subtotal))
                        .append("\nGST (18%): ₹").append(String.format("%.2f", gst))
                        .append("\nTotal Paid: ₹").append(String.format("%.2f", total))
                        .append("\n\n📦 Shipping to: ").append(byOrderId.getAddress())
                        .append("\n\n🙏 Thank you for shopping at Pushkar Store!");

                // ✅ Send WhatsApp message
                // Make sure byOrderId.getPhone() returns number like "+918765432100"
                System.out.println(byOrderId.getPhone());
                String phone = byOrderId.getPhone();
                if (!phone.startsWith("+")) {
                    phone = "+91" + phone;
                }
                whatsAppService.sendMessage(phone, message.toString());

            } catch (Exception e) {
                System.out.println("❌ Error during order update: " + e.getMessage());
            }
        }
    }
}
