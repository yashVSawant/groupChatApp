const groupId = localStorage.getItem("selectedGroupId");
const groupName = localStorage.getItem("selectedGroupName");
const token = localStorage.getItem('grpChatappToken');
const search = document.getElementById('search');
const showSearchedUsers = document.getElementById(`showSearchedUsers`);
const members = document.getElementById('members');
const back = document.getElementById('back');
const exit = document.getElementById('exit');
const host = "http://localhost:3000";
const socket = io(host);
members.innerHTML='';

window.addEventListener('DOMContentLoaded',async()=>{
    document.getElementById('headName').innerText = groupName
    const membersInGroup = await axios.get(`${host}/group/getMembersInGroup?GroupId=${groupId}`,{headers:{'Authorization':token}});
    const admin = membersInGroup.data.admin;
    console.log(membersInGroup);
    if(admin){
        membersInGroup.data.groupMembers.forEach((item)=>{
            displayMembersAdmin(item.user.name,item.user.id,item.isAdmin);
        })
    }else{
        membersInGroup.data.groupMembers.forEach((item)=>{
            displayMembers(item.user.name,item.user.id,item.isAdmin);
        })
    }
})
    

members.addEventListener('click',async(e)=>{
    try{
        if(e.target.classList.contains('remove')){
            // console.log(e.target.parentNode.id)
            const id = parseInt(e.target.parentNode.id);
            // console.log(id)
            await axios.delete(`${host}/group/removeFromGroup?userId=${id}&groupId=${groupId}`,{headers:{'Authorization':token}})
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            alert('succefully removed');
        }else if(e.target.classList.contains('makeAdmin')){
            // console.log(e.target.parentNode.parentNode.parentNode.parentNode.parentNode)
            const id = parseInt(e.target.parentNode.id);
            console.log(id)
            const makeUserAdmin = await axios.put(`${host}/group/makeAdmin?userId=${id}&groupId=${groupId}`,{},{headers:{'Authorization':token}})
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
        const getUsers = await axios.get(`${host}/user/searchUser?searchMember=${searchMember}`,{headers:{'Authorization':token}})
        getUsers.data.users.forEach((item)=>{
            // console.log(item);
            showSearchedNames(item.name,item.phoneNo,showSearchedUsers);
        })
        document.getElementById('searchMember').value="";
        }catch(err){
            alert('user not found');
        }
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
    console.log(token)
    await axios.delete(`${host}/group/exitFromGroup?groupId=${groupId}`,{headers:{'Authorization':token}})
    location.href='../chatHomePage/chatHomePage.html'
})

back.addEventListener('click',()=>{
    location.href="../chatHomePage/chatHomePage.html"
})

// show searched names
function showSearchedNames(name,phone,showSearchedUsers){
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
        await axios.post(`${host}/group/inviteUserInGroup`,{phoneNo,groupId},{headers:{'Authorization':token}})
        socket.emit('send-request',({phoneNo ,groupId}));
    }catch(err){
        console.log(err);
    }
}