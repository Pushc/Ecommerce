package com.pushkar.PaymentGateway.Service;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.pushkar.PaymentGateway.DTO.CartItemDto;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(String orderId, String name, String address, double totalAmount, List<CartItemDto> items) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(byteArrayOutputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Load the bold font
       PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);


        // Add invoice title with bold font
        Paragraph title = new Paragraph("🧾 Invoice #" + orderId)
                .setFont(boldFont)
                .setFontSize(20)
                .setMarginBottom(15);
        document.add(title);

        // Customer details
        document.add(new Paragraph("Customer Name: " + name));
        document.add(new Paragraph("Shipping Address: " + address).setMarginBottom(10));

        // Product table
        Table table = new Table(new float[]{4, 1, 2, 2});
        table.setWidth(UnitValue.createPercentValue(100));
        table.addHeaderCell("Item");
        table.addHeaderCell("Qty");
        table.addHeaderCell("Price (₹)");
        table.addHeaderCell("Subtotal (₹)");

        double subtotal = 0;

        for (CartItemDto item : items) {
            double itemSubtotal = item.getPrice() * item.getQuantity();
            subtotal += itemSubtotal;

            table.addCell(item.getName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.format("%.2f", item.getPrice()));
            table.addCell(String.format("%.2f", itemSubtotal));
        }

        document.add(table);

        // Calculate GST
        double gstRate = 0.18;
        double gstAmount = subtotal * gstRate;
        double totalWithGst = subtotal + gstAmount;

        // Add summary
        Paragraph summaryHeader = new Paragraph("Summary")
                .setFont(boldFont)
                .setFontSize(14);
        document.add(summaryHeader);

        Table summary = new Table(2);
        summary.setWidth(UnitValue.createPercentValue(50));

        summary.addCell("Subtotal");
        summary.addCell("₹" + String.format("%.2f", subtotal));

        summary.addCell("GST (18%)");
        summary.addCell("₹" + String.format("%.2f", gstAmount));

        summary.addCell("Total Paid");
        summary.addCell("₹" + String.format("%.2f", totalWithGst));

        document.add(summary);

        document.add(new Paragraph("\nThank you for shopping with Pushkar Store!").setMarginTop(20));

        document.close();
        return byteArrayOutputStream.toByteArray();
    }
}
