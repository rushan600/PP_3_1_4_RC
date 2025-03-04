const URL = "http://localhost:8080/api/admin/users";

const roleList = []
$(document).ready( function () {
    getAllUsers();
    fetch("http://localhost:8080/api/admin/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                roleList.push(role)
            })
        })
})
function getAllUsers() {
    const usersTable = $('.users-table');
    usersTable.empty();
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(users => {
            users.forEach(user => {
                let row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(r => r.name.substring(5)).join(", ")}</td>
                        <td>
                            <button type="button" class="btn btn-info text-white" data-bs-toggle="modal"
                            onclick="showEditModal(${user.id})">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" 
                            onclick="showDeleteModal(${user.id})">Delete</button>
                        </td>
                    </tr>
                `;
                usersTable.append(row);
            });
        })
        .catch(err => console.error("Error loading users:", err));
}

function displayUserInfo(user) {

    document.getElementById('user-email').textContent = user.getEmail();

    const rolesContainer = document.getElementById('user-roles');
    rolesContainer.innerHTML = '';
    user.getRoles().forEach(role => {
        const span = document.createElement('span');
        span.className = 'text-white';
        span.style.fontSize = '1.5em';
        span.textContent = role.toString();
        rolesContainer.appendChild(span);
    });
}


fetch(URL)
    .then(response => response.json())
    .then(users => {

        const user = users[0];
        displayUserInfo(user);
    })
    .catch(err => console.error("Ошибка при загрузке пользователей:", err));


function newUser(){
    let newUserForm = $('#new-user-form')[0]
    fillRoles(newUserForm);
    newUserForm.addEventListener("submit", (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let newUser = JSON.stringify({
            username:  $(`[name="username"]` , newUserForm).val(),
            password:  $(`[name="password"]` , newUserForm).val(),
            email:  $(`[name="email"]` , newUserForm).val(),
            roles: getRole(newUserForm)
        })
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        }).then(r => {
            newUserForm.reset()
            if(!r.ok) {
                alert("User with this username already exist!!")
            }else {
                $('#users-table-tab')[0].click()
            }
        })
    })
}

function showEditModal(id) {
    const editModal = new bootstrap.Modal($('.edit-modal'))
    const editForm = $('#edit-form')[0]
    showModal(editForm, editModal, id)
    editForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        let newUser = JSON.stringify({
            id: $(`[name="id"]` , editForm).val(),
            username:  $(`[name="username"]` , editForm).val(),
            password:  $(`[name="password"]` , editForm).val(),
            email:  $(`[name="email"]` , editForm).val(),
            roles: getRole(editForm)
        })
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        }).then(r => {
            editModal.hide()
            $('#users-table-tab')[0].click()
            if(!r.ok) {
                alert("User with this username already exist!!")
            }
        })
    })
}

function showDeleteModal(id) {
    const deleteModal = new bootstrap.Modal($('.delete-modal'))
    const deleteForm = $('#delete-form')[0]
    showModal(deleteForm, deleteModal, id)
    deleteForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        fetch(URL + `/${$(`[name="id"]` , deleteForm).val()}`, {
            method: 'DELETE'
        }).then(r => {
            deleteModal.hide()
            $('#users-table-tab')[0].click()
            if(!r.ok) {
                alert("Deleting process failed!!")
            }
        })
    })
}

function showModal(form, modal, id) {
    modal.show()
    fillRoles(form)
    fetch(URL + `/${id}`).then(response => {
        response.json().then(user => {
            $(`[name="id"]`,form).val(user.id)
            $(`[name="username"]`,form).val(user.username)
            $(`[name="email"]`,form).val(user.email)
        })
    })
}

function fillRoles(form) {
    roleList.forEach(role => {
        const roleName = role.name.replace("ROLE_", "");
        let option = `<option value="${role.id}">${roleName}</option>`;
        $(`[name="roles"]`, form).append(option);
    });
}

function getRole(form) {
    let roles = [];
    let options = $(`[name="roles"]`, form)[0].options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            const roleName = roleList[i].name.replace("ROLE_", "");
            roles.push({
                id: roleList[i].id,
                name: roleName
            });
        }
    }
    return roles;
}



