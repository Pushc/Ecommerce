
package com.pushkar.PaymentGateway.Service;

import com.pushkar.PaymentGateway.DTO.CartItemDto;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PdfService pdfService;

    public void sendEmailWithItems(String toEmail, String name, String address, double amount, List<CartItemDto> items, String orderId) {
        try {
            // 1. Build the same plain-text email body
            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(name).append(",\n\n");
            body.append("🎉 Thank you for your order! Here's your receipt:\n\n");

            double subtotal = 0;

            for (CartItemDto item : items) {
                double itemSubtotal = item.getQuantity() * item.getPrice();
                subtotal += itemSubtotal;
                body.append("- ").append(item.getName())
                        .append(" x").append(item.getQuantity())
                        .append(" @ ₹").append(item.getPrice())
                        .append(" = ₹").append(String.format("%.2f", itemSubtotal)).append("\n");
            }



            double gstRate = 0.18; // 18% GST
            double gstAmount = subtotal * gstRate;
            double totalWithGST = subtotal + gstAmount;

            body.append("\nSubtotal: ₹").append(String.format("%.2f", subtotal));
            body.append("\nGST (18%): ₹").append(String.format("%.2f", gstAmount));
            body.append("\nTotal Paid: ₹").append(String.format("%.2f", totalWithGST)).append("\n");

            body.append("\nShipping Address:\n").append(address).append("\n");
            body.append("Total Paid: ₹").append(amount).append("\n\n");
            body.append("🛍️ We'll process your order and update you soon!\n");
            body.append("\nRegards,\nPushkar Store Team");

            // 2. Generate the PDF
            byte[] pdfBytes = pdfService.generateInvoicePdf(orderId, name, address, amount, items);

            // 3. Build and send the email with attachment
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // 'true' enables multipart

            helper.setTo(toEmail);
            helper.setSubject("🧾 Your Order Receipt from Pushkar Store");
            helper.setText(body.toString());  // plain text body

            helper.addAttachment("Invoice_" + orderId + ".pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(message);

        } catch (Exception e) {
            System.out.println("Error sending email with PDF: " + e.getMessage());
        }
    }
}
