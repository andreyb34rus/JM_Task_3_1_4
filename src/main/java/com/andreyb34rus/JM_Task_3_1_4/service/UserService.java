package com.andreyb34rus.JM_Task_3_1_4.service;

import com.andreyb34rus.JM_Task_3_1_4.model.Role;
import com.andreyb34rus.JM_Task_3_1_4.model.User;
import com.andreyb34rus.JM_Task_3_1_4.repository.RoleRepository;
import com.andreyb34rus.JM_Task_3_1_4.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager em;

    public User getUserByEmail(String email) {
        /*
        // один из способов для устранения ошибки LazyInitializationException
        User user = userRepository.findByEmail(email);
        user.getRoles().iterator();
        return user;
        */
        // один из способов для устранения ошибки LazyInitializationException
        TypedQuery<User> user = em.createQuery(
                "SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :emailParam", User.class);
        user.setParameter("emailParam", email);
        return user.getSingleResult();
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
        roleRepository.save(userRole);
        roleRepository.save(adminRole);
        userRepository.save(new User("user", "user", (byte) 30, "user@mail.ru", "123", new HashSet<Role>() {{
            add(userRole);
        }}));
        userRepository.save(new User("admin", "admin", (byte) 35, "admin@mail.ru", "456", new HashSet<Role>() {{
            add(userRole);
            add(adminRole);
        }}));
    }
}
