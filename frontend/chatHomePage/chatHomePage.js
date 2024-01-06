// const message = require("../../models/message");

// const selectedFile = ref();
const host = 'http://localhost:3000';
const socket = io(host);
const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('inputDiv');
const showGroups = document.getElementById('showGroups');
const createGroup = document.getElementById('createGroup');
const creatNewGroup = document.getElementById('creatNewGroup');
const add = document.getElementById('add');
const addNewMember = document.getElementById('addNewMember');
const getMembersInfo = document.getElementById('getMembersInfo');
const backFromMember = document.getElementById('backFromMember');
const backFromAdd = document.getElementById('backFromAdd');
const search = document.getElementById('search');
const showSearchedUsers = document.getElementById('showSearchedUsers');

let oldChatsArray;

socket.on('connect',()=>{
    console.log(`connected with ${socket.id}`);
})

socket.on('recive-message',(groupId)=>{
    if(chatDiv.classList.value == groupId){
        const lastMsgId = getLastMsg(groupId);
        console.log(lastMsgId);
        displayMessage(groupId,lastMsgId);
    }else{
        console.log(groupId);
        const groupDiv = document.getElementById(`${groupId}`);
        groupDiv.style.backgroundColor='red'
    }
})

// socket.on('joined-newGroup',groupId=>{
//     console.log('>>>>',groupId)
// })


window.addEventListener('DOMContentLoaded',async()=>{ 
    try{           
        const groupsData = await axios.get(`${host}/user/getGroups`,{headers:{'Authorization':token}});
        // console.log(groupsData)
        groupsData.data.groups.forEach((item)=>{
            // console.log(item.Group.name,item.Group.id,item.isAdmin);
            displayGroups(item.Group.name,item.Group.id,item.isAdmin);
            const groupId = item.Group.id;
            socket.emit('join-group',groupId,message=>{
                console.log(message ,'joined')
            });
        })
    }catch(err){
        console.log(err);
    }
})

send.addEventListener('click',async(e)=>{

    if(e.target.classList.contains('send')){
        try{
            const groupId = -1*(e.target.id);
            console.log('>>>>>',groupId)
            const text = document.getElementById('text').value;
            const file = document.getElementById('file').files[0];
        //    console.log(file);
        
            if(text){
                await axios.post(`${host}/message/postMessage`,{text,groupId},{headers:{'Authorization':token}});
            }
            
            if(file){
                console.log('>>>>>',file)
                const formData = new FormData();
                formData.append('groupId', groupId);
                formData.append('file', file);
                await axios.post(`${host}/message/postFile`,formData,{headers:{'Authorization':token,'Content-Type': 'multipart/form-data'},'enctype':"multipart/form-data"});

                
            }
            document.getElementById('text').value ='';
            document.getElementById('file').value='';
            await socket.emit('send-message',groupId);
            const lastMsgId = getLastMsg(groupId);
            console.log(lastMsgId);
            displayMessage(groupId,lastMsgId);
        }catch(err){
            console.log(err);
        }
    }
    
})

createGroup.addEventListener('click',()=>{
    const mainDiv = document.getElementById('mainDiv');
    const newGroup = document.getElementById('newGroup');

    mainDiv.style.display='none';
    newGroup.style.display='inline';
})

creatNewGroup.addEventListener('click',async()=>{
    try{
        const name = document.getElementById('groupName').value;
        const getGroup = await axios.post(`${host}/user/createGroup`,{name},{headers:{'Authorization':token}});
        // console.log();
        displayGroups(name,getGroup.data.group.GroupId,getGroup.data.group.isAdmin)
        alert('group is created successfully');
        const mainDiv = document.getElementById('mainDiv');
        const newGroup = document.getElementById('newGroup');

        mainDiv.style.display='flex';
        newGroup.style.display='none';

    }catch(err){
        console.log(err)
        alert('Error something went wrong');
    }

})

showGroups.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('group')){
        try{
            // console.log();
     const groupId = e.target.parentNode.id;
     const groupDiv = document.getElementById(`${groupId}`);
     groupDiv.style.backgroundColor='white'
     chatDiv.innerHTML=`<h3>${e.target.parentNode.childNodes[0].innerText} :</h3>`;
     chatDiv.className=`${groupId}`
     createSendButton(groupId);
    //  localStorage.setItem(`chats${groupId}`,'');
     let oldChats =localStorage.getItem(`chats${groupId}`);
     
     oldChatsArray = oldChats?JSON.parse(oldChats):[];
    //  console.log(oldChatsArray);
     oldChatsArray.forEach((item)=>{
        if(!item.imageUrl){
            printMessage(item.text ,item.User.name ,groupId);
            // console.log(item)
        }else{
            displayImage(item.imageUrl ,item.User.name ,groupId);
        } 
    })
     const lastMsgId = getLastMsg(groupId);
     displayMessage(groupId,lastMsgId);
        }catch(err){
            console.log(err);
        }

    }else if(e.target.classList.contains('addMember')){
        const groupId = e.target.parentNode.id; 
        const mainDiv = document.getElementById('mainDiv');
        const addmember = document.getElementById('addmember');

        mainDiv.style.display='none';
        addmember.style.display='inline';
        addNewMember.addEventListener('click',async()=>{
            try{
                const memberInfo = document.getElementById('memberPhoneNo').value;
                addUserInGroup(memberInfo,groupId)
            }catch(err){
                console.log(err);
            }
        })

        addmember.addEventListener('click',async(e)=>{
            if(e.target.classList.contains('addThisMember')){
                
                const result = e.target.parentNode.innerText.split('-')[1];
                const phone = parseInt(result);
                addUserInGroup(phone,groupId);
            }
        })
    }else if(e.target.classList.contains('members')){
        // console.log('okay');
        const groupId = e.target.parentNode.id; 
        const mainDiv = document.getElementById('mainDiv');
        const getMembers = document.getElementById('getMembers');

        mainDiv.style.display='none';
        getMembers.style.display='inline';

        getMembersInfo.innerHTML='';
        const membersInGroup = await axios.get(`${host}/user/getMembersInGroup?GroupId=${groupId}`,{headers:{'Authorization':token}});
        const admin = membersInGroup.data.admin;
        if(admin){
            membersInGroup.data.groupMembers.forEach((item)=>{
                displayMembersAdmin(item.User.name,item.User.id,item.isAdmin);
            })
        }else{
            membersInGroup.data.groupMembers.forEach((item)=>{
                displayMembers(item.User.name,item.User.id,item.isAdmin);
            })
        }
        getMembersInfo.addEventListener('click',async(e)=>{
            try{
                if(e.target.classList.contains('remove')){
                    // console.log(e.target.parentNode.id)
                    const id = Math.round(e.target.parentNode.id -0.1);
                    // console.log(id)
                    await axios.delete(`${host}/user/removeFromGroup?userId=${id}&groupId=${groupId}`,{headers:{'Authorization':token}})
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                    alert('succefully removed');
                }else if(e.target.classList.contains('makeAdmin')){
                    const id = +e.target.parentNode.id -0.1;
                    const makeUserAdmin = await axios.put(`${host}/user/makeAdmin?userId=${id}&groupId=${groupId}`,{},{headers:{'Authorization':token}})
                    const editDiv = document.getElementById(e.target.parentNode.id);
                    editDiv.innerHTML=`${makeUserAdmin.data.user.name}  (admin)<button class='remove'>remove</button>`;
                }
            }catch(err){
                console.log(err)
            }
        })
    }
})

search.addEventListener('click',async()=>{
    const searchMember = document.getElementById('searchMember').value;
        // console.log(groupId);
    const getUsers = await axios.get(`${host}/user/search?searchMember=${searchMember}`,{headers:{'Authorization':token}})
    getUsers.data.users.forEach((item)=>{
        // console.log(item);
        showSearchedNames(item.name,item.id,item.phoneNo);
    })

})

backFromAdd.addEventListener('click',()=>{
        const addmember = document.getElementById('addmember');
        back(addmember);
})

backFromMember.addEventListener('click',()=>{
        const getMembers = document.getElementById('getMembers');
        back(getMembers);
})

function back(getDiv){
    
    const mainDiv = document.getElementById('mainDiv');
    mainDiv.style.display='flex';
    getDiv.style.display='none';
}

function printMessage(message , textedBy ,id){
    // console.log(id);
    const msg = document.createElement('div');
    msg.innerText=`${textedBy} : ${message}`;
    chatDiv.appendChild(msg);
    // console.log(chatDiv.classList.value)
}

function displayImage(imageUrl,textedBy ,id){
    const msg = document.createElement('div');
    msg.innerHTML=`${textedBy} : <img src="${imageUrl}" alt="image" width="100" height="80">`;
    chatDiv.appendChild(msg);
}

function saveImageLocally(){
    
}

function displayGroups(name,id, isAdmin){
    // console.log(isAdmin);
    const newDiv = document.createElement('div');
    if(isAdmin){
        newDiv.innerHTML=`<button class='group'>${name}</button>
        <button class='addMember'>Add</button>
        <button class='members'>members</button>`;
    }else{
        newDiv.innerHTML=`<button class='group'>${name}</button>
        <button class='members'>members</button>`;
    }
    newDiv.id = id;
    newDiv.style.backgroundColor='white'
    showGroups.appendChild(newDiv);
}

function createSendButton(id){
    send.innerHTML=
    `
    <input type="text" id="text">
    <input type="file" id="file" name="file" multiple="multiple" accept="image/*,video/*">
    <button type='submit' class="send" id=${-id}>send</button>
    `
}

function displayMembers(name,id,isAdmin){
    const div = document.createElement('div');
    if(isAdmin){
        div.innerHTML=`${name}  (admin)`;
    }else{
        div.innerHTML=`${name}`;
    }
    
    div.id=id+0.1;
    getMembersInfo.appendChild(div);
}
function displayMembersAdmin(name,id,isAdmin){
    const div = document.createElement('div');
    if(isAdmin){
        div.innerHTML=`${name}  (admin)<button class='remove'>remove</button>`;
    }else{
        div.innerHTML=`${name}<button class='remove'>remove</button><button class='makeAdmin'>make admin</button>`;
    }
    
    div.id=id+0.1;
    getMembersInfo.appendChild(div);
}

function showSearchedNames(name,id,phone){
    const div = document.createElement('div');
    div.innerHTML=`${name}-   ${phone}<button class='addThisMember'>add</button>`;
    div.id=id+0.2;
    showSearchedUsers.appendChild(div);
}

async function addUserInGroup(memberInfo,groupId){
    try{
        await axios.post(`${host}/user/addUserToGroup`,{memberInfo,groupId},{headers:{'Authorization':token}})
        // socket.emit('join-newGroup',groupId);
        socket.emit('join-group',groupId);
        const mainDiv = document.getElementById('mainDiv');
        const addmember = document.getElementById('addmember');

        mainDiv.style.display='flex';
        addmember.style.display='none';
    }catch(err){
        console.log(err);
    }
}

async function displayMessage(groupId,lastMsgId){
    
     console.log(lastMsgId)
     // setInterval(async()=>{
     const chats = await axios.get(`${host}/message/getMessages?lastMsgId=${lastMsgId}&groupId=${groupId}`,{headers:{'Authorization':token}});
     console.log(chats.data.success);
     if(chats.data.success){
             chats.data.groupChats.forEach((item)=>{
                if(!item.imageUrl){
                    printMessage(item.text ,item.User.name ,groupId);
                }else{
                    displayImage(item.imageUrl ,item.User.name ,groupId);
                }
             // console.log(item)
             }) 
             
             oldChatsArray = oldChatsArray.concat(chats.data.groupChats)
             // console.log(oldChatsArray);
            //  lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
             // console.log('....>',lastMsgId);
             while(oldChatsArray.length>10){
                 oldChatsArray.shift();
             }
             localStorage.setItem(`chats${groupId}`,JSON.stringify(oldChatsArray));
     }
    //  localStorage.setItem(`chats${groupId}`,'');
     
     
     // },1000)
}

function getLastMsg(groupId){
    let oldChats =localStorage.getItem(`chats${groupId}`);
     
     oldChatsArray = oldChats?JSON.parse(oldChats):[];
    
     const lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
     return lastMsgId;
}