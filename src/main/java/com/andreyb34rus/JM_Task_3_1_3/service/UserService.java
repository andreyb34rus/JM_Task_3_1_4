package com.andreyb34rus.JM_Task_3_1_3.service;

import com.andreyb34rus.JM_Task_3_1_3.model.Role;
import com.andreyb34rus.JM_Task_3_1_3.model.User;
import com.andreyb34rus.JM_Task_3_1_3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserById(long id) {
        return userRepository.findById(id).get(); //eager operation
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public void update(User user) {
        userRepository.save(user);
    }

    public void delete(long id) {
        userRepository.deleteById(id);
    }

    public void setInitData() {
        Role userRole = new Role("ROLE_USER");
        Role adminRole = new Role("ROLE_ADMIN");
        userRepository.save(new User("user", "user", (byte) 30, "user@mail.ru", "123", new HashSet<Role>() {{
            add(userRole);
        }}));
        userRepository.save(new User("admin", "admin", (byte) 35, "admin@mail.ru", "456", new HashSet<Role>() {{
            add(userRole);
            add(adminRole);
        }}));
    }
}
