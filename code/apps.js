const usersApi = 'http://localhost:3000/data';
const openCreateModal = document.querySelector('.CreateBtn'),
createModal = document.querySelector('.CreateModal'),
createUserBtn = document.querySelector('.Create'),
cancelBtn = document.querySelector('.Cancel'),
firstNameData = document.querySelector('.firstNameForm'),
lastNameData = document.querySelector('.lastNameForm'),
emailData = document.querySelector('.emailForm'),
avatarData = document.querySelector('.avatar'),
listUser = document.querySelector('.userTable');
let i = 7;
function start(){
    getUsers(renderUsers)
    handleCreateForm()
}
start();
function getUsers(callback){
    fetch(usersApi)
    .then(respone =>{
        return respone.json()
    })
    .then(callback)
}
function renderUsers(json){
    const htmls = json.map(item =>{
        return `
        <tr class="user-${item.id}">
            <td>${item.id}</td>
            <td class="firstName-${item.id}">${item.first_name}</td>
            <td class="lastName-${item.id}">${item.last_name}</td>
            <td class="email-${item.id}">${item.email}</td>
            <td><img src="${item.avatar}" class="avatar-${item.id}"></td>
            <td><button onclick="deleteUser(${item.id})" class="btn delete">Delete</button>
            <br><br>
            <button class="btn  Edit" onclick="handleEditUserData(${item.id})">Edit</button> </td>
        </tr>`
    })
    listUser.innerHTML += htmls.join(''); //why join()?

}

function handleCreateForm(){
    openCreateModal.onclick = function(){
        createModal.style.display = 'flex';
        createModal.querySelector('h1').innerHTML = 'Contact Form';
        createUserBtn.textContent = 'Create';
    }
    cancelBtn.onclick = closeModal
    createUserBtn.onclick = function(){
        const formData =
            {   
                id: i++,
                first_name: firstNameData.value,
                last_name: lastNameData.value,
                email: emailData.value,
                avatar: avatarData.value
            }
        ;
        const fillForm = firstNameData.value == ''||lastNameData.value == ''||emailData.value==''||avatarData.value==''; 
        if(fillForm){
            alert('Error')
        }else{
            createUser(formData, renderUsers)
            firstNameData.value='';
            lastNameData.value='';
            emailData.value='';
            avatarData.value='';
            createModal.style.display = 'none';
        }
    }
}
function createUser(data,callback){
    const options ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    
    fetch(usersApi,options)
        .then(function(respone){
            return respone.json()
        })
        .then(callback) 
}
function closeModal(){
    createModal.style.display = 'none';
    firstNameData.value='';
    lastNameData.value='';
    emailData.value='';
    avatarData.value='';
}
function deleteUser(id){
    const options ={
        method:'DELETE',
    };
    fetch(usersApi+'/'+id,options)
        .then(function(respone){
            return respone.text() //.json() không được
        })
        .then(function(){
            const user = document.querySelector('.user-'+id)
             user.remove()
        })
}
function handleEditUserData(id){
    createModal.style.display = 'flex';
    createModal.querySelector('h1').innerHTML = 'Edit Profile';
    createUserBtn.textContent = 'Edit';
    firstNameData.value = document.querySelector('.firstName-'+id).innerHTML;
    console.log(document.querySelector('.firstName-'+id))
    lastNameData.value = document.querySelector('.lastName-'+id).innerHTML;
    emailData.value = document.querySelector('.email-'+id).innerHTML;
    avatarData.value = document.querySelector('.avatar-'+id).innerHTML;
    if(createUserBtn.textContent = 'Edit'){
        createUserBtn.onclick = function(){
            const formEditData = {
                id: i++,
                first_name: firstNameData.value,
                last_name: lastNameData.value,
                email: emailData.value,
                avatar: avatarData.value
            }
            editUserData(id,formEditData,renderUsers)
        }
    }
}
function editUserData(id,data,callback){
    const options = {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    fetch(usersApi + '/' + id,options)
        .then(respone=>respone.json())
        .then(callback)
}
