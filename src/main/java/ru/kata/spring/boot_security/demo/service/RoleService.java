package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.entity.Role;
import java.util.List;

public interface RoleService {
    void save (Role role);
    List<Role> getListRoles();
}
