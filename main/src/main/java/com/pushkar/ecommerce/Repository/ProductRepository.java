package com.pushkar.ecommerce.Repository;

import com.pushkar.ecommerce.entity.Product;
import com.pushkar.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
