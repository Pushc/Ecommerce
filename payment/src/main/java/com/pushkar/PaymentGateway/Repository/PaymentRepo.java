package com.pushkar.PaymentGateway.Repository;

import com.pushkar.PaymentGateway.Entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentOrder,Long> {
    PaymentOrder findByOrderId(String orderId);

    @Query("SELECT SUM(p.amount) FROM PaymentOrder p WHERE p.status = 'SUCCESS'")
    Double getTotalRevenue();

    @Query("SELECT COUNT(p) FROM PaymentOrder p WHERE p.status = 'SUCCESS'")
    Long getSuccessfulOrderCount();

    List<PaymentOrder> findByEmail(String email);
}
