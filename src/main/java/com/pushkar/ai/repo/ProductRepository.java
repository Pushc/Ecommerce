package com.pushkar.ai.repo;


import com.pushkar.ai.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryAndPriceLessThan(String category, double price);

    List<Product> findByCategoryAndPriceGreaterThan(String category, double price);

}
