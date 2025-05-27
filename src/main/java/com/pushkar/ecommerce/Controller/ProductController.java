package com.pushkar.ecommerce.Controller;

import com.pushkar.ecommerce.Service.ProductService;
import com.pushkar.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts()
    {
        return productService.getAllProducts();
    }

    @GetMapping("/{p_id}")
    public Product getProductById(@PathVariable Long p_id)
    {
        return productService.getProductById(p_id);
    }
}
