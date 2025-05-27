package com.pushkar.ecommerce.dto;

import java.util.Map;

public class OrderRequest {

    // key - product id
    // value - product quantity

    private Map<Long,Integer> productQuantities;

    private double totalAmount;

    public Map<Long, Integer> getProductQuantities() {
        return productQuantities;
    }

    public void setProductQuantities(Map<Long, Integer> productQuantities) {
        this.productQuantities = productQuantities;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
