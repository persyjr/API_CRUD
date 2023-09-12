const userForm= document.querySelector('#userForm')

let users =[]
edditing= false;
let userId=0;

window.addEventListener('DOMContentLoaded', async ()=> {
    const response =await fetch('/api/users');
    const data = await response.json()
    users=data;
    
    renderUser(users)
});


userForm.addEventListener('submit', async e => {
    e.preventDefault()
    
    const username=userForm['username'].value
    const especie=userForm['especie'].value
    const planeta=userForm['planeta'].value
    
    if (!edditing){
        const response = await fetch('/api/users',{
            method:'POST' ,  // or 'PUT'
            headers:{
                'content-Type':'application/json'
            },
            body: JSON.stringify({
                username,
                especie,
                planeta
            })
        })
        const data= await response.json();
        
        users.unshift(data);
    }else{
        const response = await fetch(`/api/users/${userId}`,{
            method:"PUT",
            headers:{
                'content-Type':'application/json'
            },
            body: JSON.stringify({
                username,
                especie,
                planeta
            }),
        });
        const updateUser = await response.json();
        users= users.map(user => user.id=== updateUser.id ? updateUser : user);
        
       
        edditing=false
        userId=null
    }
    
    renderUser(users);
    userForm.reset();

});

function renderUser(users) {
    const userList=document.querySelector('#userList')
    console.log(userList)
    userList.innerHTML=''
    
    users.forEach(user => {
        const userItem = document.createElement('li')
        userItem.classList='list-group-item my-2'
        userItem.innerHTML = `
            <header class="d-flex justify-content-around align-items-center">
                <h5 style="width:60%;">${user.username}</h5>
                
                <div  style="width:30%;">
                    <p>${user.especie}</p>
                    <p>${user.planeta}</p>
                </div>
                <div style="width:20%;">
                    <button class="btn btnDelete btn-danger btn-sm" style="width:50%;"><i class="fa fa-close" style="width:36px;"></i></button>
                    <button class="btn btnEdit btn-primary btn-sm" style="width:50%;"><i class="fa fa-edit" style="width:36px;"></i></button>
                </div>
            <header>
            
        `
        const btnDelete = userItem.querySelector('.btnDelete')
        btnDelete.addEventListener('click', async ()=> {
           const response = await fetch(`/api/users/${user.id}`,{
                method:"DELETE"
            })
            const data = await response.json()
            users=users.filter(user => user.id != data.id)
            renderUser(users)
        })
        
        const btnEdit = userItem.querySelector('.btnEdit')
        btnEdit.addEventListener('click',async e=>{
            const response = await fetch(`/api/users/${user.id}`)
            const data =await response.json()
            userForm['username'].value=data.username;
            userForm['especie'].value=data.especie;
            userForm['planeta'].value=data.planeta;
            edditing=true
            userId=data.id
        })
        
        userList.append(userItem)
        
    })
    
}