package com.pushkar.ecommerce.Repository;

import com.pushkar.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
//    Optional<User> findByname(String username);

    Optional<User> findByEmail(String email);
}
