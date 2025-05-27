package com.pushkar.ecommerce.Controller;


import com.pushkar.ecommerce.Service.OrderService;
import com.pushkar.ecommerce.dto.OrderDTO;
import com.pushkar.ecommerce.dto.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place/{userID}")
    public OrderDTO placeOrder(@PathVariable Long userID, @RequestBody OrderRequest orderRequest)
    {
        return orderService.placeOrder(userID,orderRequest.getProductQuantities(),orderRequest.getTotalAmount());
    }

    @GetMapping("/getAllOrders")
    public List<OrderDTO> getAll()
    {
        return orderService.getAllOrders();
    }

    @GetMapping("/getOrder/{userId}")
    public List<OrderDTO> getOrderById(@PathVariable Long userId)
    {
        return orderService.getOrderByUser(userId);
    }

}
