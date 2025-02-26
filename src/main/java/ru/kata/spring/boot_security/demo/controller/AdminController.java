package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String getUser(Principal principal, Model model) {
        model.addAttribute("roles", roleService.getListRoles());
        model.addAttribute("newUser", new User());
        model.addAttribute("authUser", userService.findByUsername(principal.getName()));
        model.addAttribute("users", userService.getAllUsers());
        return "admin";
    }

    @PostMapping
    public String create(@ModelAttribute("newUser") @Valid User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PatchMapping("/user/{id}")
    public String updateUser(@ModelAttribute("user") @Valid User user, @PathVariable("id") long id) {
        userService.updateUser(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
