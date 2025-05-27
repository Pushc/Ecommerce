package com.pushkar.ecommerce.Service;

import com.pushkar.ecommerce.Repository.OrderRepository;
import com.pushkar.ecommerce.Repository.ProductRepository;
import com.pushkar.ecommerce.Repository.UserRepository;
import com.pushkar.ecommerce.dto.OrderDTO;
import com.pushkar.ecommerce.dto.OrderItemDTO;
import com.pushkar.ecommerce.entity.OrderItem;
import com.pushkar.ecommerce.entity.Orders;
import com.pushkar.ecommerce.entity.Product;
import com.pushkar.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public OrderDTO placeOrder(Long userID, Map<Long, Integer> productQuantities, double totalAmount) {
            User user = userRepository.findById(userID).orElseThrow(()->
                    new RuntimeException("User not Found !!!!"));

            Orders order = new Orders();
            order.setUser(user);
            order.setOrderDate(new Date());
            order.setStatus("Pending");
            order.setTotalAmount(totalAmount);

            List<OrderItem> orderItems = new ArrayList<>();
            List<OrderItemDTO> orderItemDTO = new ArrayList<>();

            for (Map.Entry<Long,Integer> entry:productQuantities.entrySet())
            {
                Product product = productRepository.findById(entry.getKey()).orElseThrow(()->(
                        new RuntimeException("Product Not Found")
                        ));

                OrderItem orderItem = new OrderItem();
                orderItem.setOrders(order);
                orderItem.setProduct(product);
                orderItem.setQty(entry.getValue());
                orderItems.add(orderItem);

                orderItemDTO.add(new OrderItemDTO(product.getName(),product.getPrice(), entry.getValue()));

            }
            order.setOrderItems(orderItems);
            Orders save = orderRepository.save(order);
            return (new OrderDTO(save.getId(),save.getTotalAmount(),save.getStatus(),save.getOrderDate(),user.getName(),user.getEmail(),orderItemDTO));

    }

    public List<OrderDTO> getAllOrders() {
        List<Orders> allOrdersWithUsers = orderRepository.findAllOrdersWithUsers();
        return allOrdersWithUsers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Orders orders) {
        List<OrderItemDTO> orderItems = orders.getOrderItems().stream().map(item -> new OrderItemDTO(item.getProduct().getName(), item.getProduct().getPrice(), item.getQty())).collect(Collectors.toList());

        return new OrderDTO(orders.getId(),orders.getTotalAmount(),orders.getStatus()!=null? orders.getStatus():"unknown",orders.getOrderDate(),orders.getUser()!=null? orders.getUser().getName():"unknown",orders.getUser()!=null? orders.getUser().getEmail():"unknown",orderItems);
    }


    public List<OrderDTO> getOrderByUser(Long userId) {
        Optional<User> byId = userRepository.findById(userId);// optional to handel null pointer exception
        if(byId.isEmpty()){
            throw new RuntimeException("User not found!!!");
        }
        User user = byId.get();
        List<Orders> ordersList = orderRepository.findByUser(user);
        return ordersList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}
