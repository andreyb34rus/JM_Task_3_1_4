// get roles array
async function getRoles() {
    try {
        const resp = await fetch("api/role/all")
        //const roles = await resp.json()
        //console.log(roles)
        return  await resp.json()
    } catch (error) {
        console.log(error.message())
    }
}

// output for user table
async function fillPrincipalTable() {
    let user
    try {
        const res = await fetch(`api/user/${userId}`)
        user = await res.json()
    } catch (error) {
        console.log(error.message)
    }
    let elem = document.getElementById("user-id")
    elem.innerText = user.id
    elem = elem.nextElementSibling
    elem.innerHTML = user.firstName
    elem = elem.nextElementSibling
    elem.innerHTML = user.lastName
    elem = elem.nextElementSibling
    elem.innerHTML = user.age
    elem = elem.nextElementSibling
    elem.innerHTML = user.email
    elem.nextElementSibling.innerHTML = user.roles.map(role => role.roleName.substr(5)).join(" ")
}

// output for users table
async function fillUsersTable() {
   // await getRoles()
    let users
    try {
        const res = await fetch("api/user/all")
        users = await res.json()
    } catch (error) {
        console.log(error.message)
    }
    let elem = document.getElementById("users-table")
    elem.innerHTML = ""
    for (const user of users) {
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.roleName.substr(5)).join(" ")}</td>
            <td>
                <button type="button" class="btn btn-info" data-bs-toggle="modal"
                        data-bs-target="#edit-modal" data-bs-updateUserId='${user.id}'>
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal"  id = "delete-button"
                        data-bs-target="#delete-modal" data-bs-deleteUserId='${user.id}'>
                    Delete
                </button>
            </td>`
        elem.appendChild(tr)
    }
}

// get data from any form
function getFormData(form) {
    let val = {}
    const roles = getRoles()
    for (const field of form) {
        if (field.name) {
            if (field.type === "select-multiple") {
                val[field.name] = []
                for (const option of field.options) {
                    if (option.selected) {
                        for ( const role of roles){
                            if(role.roleName === ('ROLE_' + option.value)){
                                val[field.name].push({
                                    id: role.id,
                                    roleName: 'ROLE_' + option.value
                                })
                            }
                        }
                    }
                }
            } else {
                if (field.value) {
                    val[field.name] = field.value
                }
            }
        }
    }
    console.log("объект из формы", val)
    return val
}

// save new user
async function saveNewUser() {
    const newUserForm = document.getElementById('newUserForm')
    const newUser = getFormData(newUserForm)
    newUserForm.onsubmit = async (event) => {
        event.preventDefault()
        const res = await fetch("/api/user", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser)
        })
        newUserForm.reset()
        await fillUsersTable()
        switchToUsersTab()
    }
}

// switch current tab to users tab
function switchToUsersTab() {
    const someTabTriggerEl = document.querySelector('#nav-tab button[data-bs-target="#nav-users"]');
    const tab = new bootstrap.Tab(someTabTriggerEl);
    tab.show()
}

// listen the delete modal to get user ID
async function listenDeleteModal() {
    const deleteModal = document.getElementById('delete-modal')
    deleteModal.addEventListener('show.bs.modal', await function (event) {
        const button = event.relatedTarget         // Button that triggered the modal
        const id = button.getAttribute('data-bs-deleteUserId'); //Extract info from data-bs-* attributes
        fillDeleteModal(id)
    })
}

// fill the delete user modal
async function fillDeleteModal(id) {
    const res = await fetch(`api/user/${id}`)
    const user = await res.json()
    document.getElementById('idDelete').setAttribute("value", user.id)
    document.getElementById('firstNameDelete').setAttribute("value", user.firstName)
    document.getElementById('lastNameDelete').setAttribute("value", user.lastName)
    document.getElementById('ageDelete').setAttribute("value", user.age)
    document.getElementById('emailDelete').setAttribute("value", user.email)
    const elem = document.getElementById('rolesDelete')
    elem.innerHTML = user.roles.map(role => "<option>" + role.roleName.substr(5) + "</option>").join(" ")
}

// delete user
async function deleteUser() {
    const id = document.getElementById('idDelete').value
    await fetch(`api/user/${id}`, {
        method: "DELETE", headers: {
            "Content-Type": "application/json"
        }
    })
}

// listen the update modal to get user ID
async function listenUpdateModal() {
    const updateModal = document.getElementById('edit-modal')
    updateModal.addEventListener('show.bs.modal', await function (event) {
        const button = event.relatedTarget         // Button that triggered the modal
        const id = button.getAttribute('data-bs-updateUserId'); //Extract info from data-bs-* attributes
        fillUpdateModal(id)
    })
}

// fill the update user modal
async function fillUpdateModal(id) {
    const res = await fetch(`api/user/${id}`)
    const user = await res.json()
    document.getElementById('idEdit').setAttribute("value", user.id)
    document.getElementById('firstNameEdit').setAttribute("value", user.firstName)
    document.getElementById('lastNameEdit').setAttribute("value", user.lastName)
    document.getElementById('ageEdit').setAttribute("value", user.age)
    document.getElementById('emailEdit').setAttribute("value", user.email)
    document.getElementById('passwordEdit').setAttribute("value", user.password)
    const elem = document.getElementById("rolesEdit")
    elem.innerHTML = user.roles.map(role => "<option>" + role.roleName.substr(5) + "</option>").join(" ")
}

// update user
async function updateUser() {
    const elem = document.getElementById('editFormBody')
    console.log(elem)
    const user = getFormData(elem)
    await fetch("api/user", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
}





