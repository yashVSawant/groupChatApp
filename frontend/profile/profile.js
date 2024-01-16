const groupId = localStorage.getItem("selectedGroupId");
const groupName = localStorage.getItem("selectedGroupName");
const token = localStorage.getItem('grpChatappToken');
const search = document.getElementById('search');
const showSearchedUsers = document.getElementById(`showSearchedUsers`);
const members = document.getElementById('members');
const back = document.getElementById('back');
const exit = document.getElementById('exit');
const deleteGroup = document.getElementById('delete');
const socket = io();
members.innerHTML='';

window.addEventListener('DOMContentLoaded',async()=>{
        try{
            document.getElementById('headName').innerText = groupName;
            const membersInGroup = await axios.get(`/group/getMembersInGroup?GroupId=${groupId}`,{headers:{'Authorization':token}});
            const admin = membersInGroup.data.admin;
            console.log(membersInGroup);
            if(admin){
                membersInGroup.data.groupMembers.forEach((item)=>{
                    displayMembersAdmin(item.user.name,item.user.id,item.isAdmin);
                })
            }else{
                document.getElementById('delete').style.display='none';
                membersInGroup.data.groupMembers.forEach((item)=>{
                    displayMembers(item.user.name,item.user.id,item.isAdmin);
                })
            }
        }catch(err){
            console.log(err);
        }
})
    
members.addEventListener('click',async(e)=>{
    try{
        if(e.target.classList.contains('remove')){
            // console.log(e.target.parentNode.id)
            const id = parseInt(e.target.parentNode.id);
            // console.log(id)
            await axios.delete(`/group/removeFromGroup?userId=${id}&groupId=${groupId}`,{headers:{'Authorization':token}})
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            alert('succefully removed');
        }else if(e.target.classList.contains('makeAdmin')){
            // console.log(e.target.parentNode.parentNode.parentNode.parentNode.parentNode)
            const id = parseInt(e.target.parentNode.id);
            console.log(id)
            const makeUserAdmin = await axios.put(`/group/makeAdmin?userId=${id}&groupId=${groupId}`,{},{headers:{'Authorization':token}})
            const editDiv = document.getElementById(e.target.parentNode.id);
            editDiv.innerHTML=`${makeUserAdmin.data.user.name}  (admin)<button class='remove'>remove</button>`;
        }
    }catch(err){
        console.log(err)
    }
})

search.addEventListener('click',async()=>{
    const searchMember = document.getElementById(`searchMember`).value; 
    if(searchMember){
        try{   
        const getUsers = await axios.get(`/user/searchUser?searchMember=${searchMember}`,{headers:{'Authorization':token}})
        getUsers.data.users.forEach((item)=>{
            // console.log(item);
            showSearchedNames(item.name,item.phoneNo);
        })
        document.getElementById('searchMember').value="";
        }catch(err){
            console.log(err)
            alert('user not found');
        }
    }else{
        const showError = document.getElementById('showError');
        showError.innerText='please enter something';
        setTimeout(()=>{
            showError.innerText='';
        },2000)
    }
})

showSearchedUsers.addEventListener('click',(e)=>{
    if(e.target.classList.contains('inviteToGroup')){
        const result = e.target.parentNode.innerText.split('-')[1];
        const phoneNo = parseInt(result);
        // console.log(phoneNo)
        // const getMembers= e.target.parentNode.parentNode.parentNode;
        inviteUserInGroup(phoneNo,groupId);
        e.target.parentNode.removeChild(e.target);
    }
})

exit.addEventListener('click',async()=>{
    try{
        await axios.delete(`/group/exitFromGroup?groupId=${groupId}`,{headers:{'Authorization':token}})
        location.href='../chatHomePage/chatHomePage.html'
    }catch(err){
        console.log(err);
    }
})

deleteGroup.addEventListener('click',async()=>{
    try{
        await axios.delete(`/group/deleteGroup?groupId=${groupId}`,{headers:{'Authorization':token}})
        location.href='../chatHomePage/chatHomePage.html'
    }catch(err){
        console.log(err)
    }
})

back.addEventListener('click',()=>{
    location.href="../chatHomePage/chatHomePage.html"
})

// show searched names
function showSearchedNames(name,phone){
    const div = document.createElement('div');
    div.innerHTML=`${name}-   ${phone}<button class='inviteToGroup'>Invite</button>`;
    showSearchedUsers.appendChild(div);
}
// show all members of group to user
function displayMembers(name,id,isAdmin){
    const div = document.createElement('div');
    if(isAdmin){
        div.innerHTML=`${name}  (admin)`;
    }else{
        div.innerHTML=`${name}`;
    }
    
    div.id=`${id}id`;
    console.log(div.id)
    members.appendChild(div);
}
// show all members of group to admin
function displayMembersAdmin(name,id,isAdmin){
    const div = document.createElement('div');
    if(isAdmin){
        div.innerHTML=`${name}  (admin)`;
    }else{
        div.innerHTML=`${name}<button class='remove'>remove</button><button class='makeAdmin'>make admin</button>`;
    }
    
    div.id=`${id}UserId`;
    // console.log(div.id)
    members.appendChild(div);
}
// adding new user in group
async function inviteUserInGroup(phoneNo,groupId){
    try{
        await socket.emit('join-phoneNo',(phoneNo))
        // console.log(phoneNo ,groupId)
        await axios.post(`/group/inviteUserInGroup`,{phoneNo,groupId},{headers:{'Authorization':token}})
        socket.emit('send-request',({phoneNo ,groupId}));
    }catch(err){
        console.log(err);
    }
}