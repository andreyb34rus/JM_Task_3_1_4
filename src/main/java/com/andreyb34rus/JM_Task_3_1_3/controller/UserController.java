package com.andreyb34rus.JM_Task_3_1_3.controller;

import com.andreyb34rus.JM_Task_3_1_3.model.User;
import com.andreyb34rus.JM_Task_3_1_3.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping(value = {("/login"), ("/index"), ("/")})
    public String login(Model model) {
        return "/login";
    }

    @GetMapping(value = "/user")
    public String getUserPage(Model model, Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        model.addAttribute("user", user);
        return "/user";
    }
}
