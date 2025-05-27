package com.pushkar.ecommerce.Repository;

import com.pushkar.ecommerce.dto.OrderDTO;
import com.pushkar.ecommerce.entity.Orders;
import com.pushkar.ecommerce.entity.Product;
import com.pushkar.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository  extends JpaRepository<Orders,Long> {

    @Query("SELECT o from Orders o JOIN FETCH o.user")
    List<Orders> findAllOrdersWithUsers();

    List<Orders> findByUser(User user);
}
