package com.pushkar.ecommerce.Service;

import com.pushkar.ecommerce.Repository.ProductRepository;
import com.pushkar.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long pId) {
        return productRepository.findById(pId).orElse(null);
    }

    public void addProduct(Product product) {
        productRepository.save(product);
        System.out.println("Product Saved Succesfully!!!!");
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
        System.out.println("Product deleted with id"+id);
    }

    public void deleteAll() {
        productRepository.deleteAll();
        System.out.println("All Products deleted...!!! ");
    }


}
