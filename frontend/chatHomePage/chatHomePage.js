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

window.addEventListener('DOMContentLoaded',async()=>{ 
    try{   
        const groupsData = await axios.get('http://localhost:3000/user/getGroups',{headers:{'Authorization':token}});
        // console.log(groupsData)
        groupsData.data.groups.forEach((item)=>{
            // console.log(item.Group.name,item.Group.id,item.isAdmin);
            displayGroups(item.Group.name,item.Group.id,item.isAdmin);
        })
    }catch(err){
        console.log(err);
    }
})

send.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('send')){
        try{
            const groupId = -1*(e.target.id);
            const text = document.getElementById('text').value;
            console.log(groupId);
            await axios.post('http://localhost:3000/message/postMessage',{text,groupId},{headers:{'Authorization':token}});
            document.getElementById('text').value ='';
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
        await axios.post('http://localhost:3000/user/createGroup',{name},{headers:{'Authorization':token}});
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
        chatDiv.innerHTML='';
        try{
            // console.log(e.target.parentNode.id);
            const groupId = e.target.parentNode.id;
            createSendButton(groupId);
            // localStorage.setItem(`chats${groupId}`,'');
            let oldChats =localStorage.getItem(`chats${groupId}`);
            
            let oldChatsArray = oldChats?JSON.parse(oldChats):[];
            // console.log(oldChatsArray);
            oldChatsArray.forEach((item)=>{
                printMessage(item.text ,item.User.name)
                // console.log(item)
                }) 
            let lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
            // console.log(lastMsgId)
            // setInterval(async()=>{
            const chats = await axios.get(`http://localhost:3000/message/getMessages?lastMsgId=${lastMsgId}&groupId=${groupId}`,{headers:{'Authorization':token}});
            // console.log(chats.data.success)
            if(chats.data.success){
                    chats.data.groupChats.forEach((item)=>{
                    printMessage(item.text ,item.User.name)
                    // console.log(item)
                    }) 
                    
                    oldChatsArray = oldChatsArray.concat(chats.data.groupChats)
                    // console.log(oldChatsArray);
                    lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
                    // console.log('....>',lastMsgId);
                    while(oldChatsArray.length>10){
                        oldChatsArray.shift();
                    }
                    localStorage.setItem(`chats${groupId}`,JSON.stringify(oldChatsArray));
            }
            // localStorage.setItem(`chats${groupId}`,'');
            
            
            // },1000)
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
                // console.log(groupId);
                await axios.post('http://localhost:3000/user/addUserToGroup',{memberInfo,groupId},{headers:{'Authorization':token}})
                const mainDiv = document.getElementById('mainDiv');
                const addmember = document.getElementById('addmember');
        
                mainDiv.style.display='flex';
                addmember.style.display='none';
            }catch(err){
                console.log(err);
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
        const membersInGroup = await axios.get(`http://localhost:3000/user/getMembersInGroup?GroupId=${groupId}`,{headers:{'Authorization':token}});
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
                    console.log(e.target.parentNode)
                    const id = +e.target.parentNode.id -0.1;
                    await axios.delete(`http://localhost:3000/user/removeFromGroup?userId=${id}&groupId=${groupId}`,{headers:{'Authorization':token}})
                    alert('succefully removed');
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                }else if(e.target.classList.contains('makeAdmin')){
                    const id = +e.target.parentNode.id -0.1;
                    const makeUserAdmin = await axios.put(`http://localhost:3000/user/makeAdmin?userId=${id}&groupId=${groupId}`,{},{headers:{'Authorization':token}})
                    const editDiv = document.getElementById(e.target.parentNode.id);
                    editDiv.innerHTML=`${makeUserAdmin.data.user.name}  (admin)<button class='remove'>remove</button>`;
                }
            }catch(err){
                console.log(err)
            }
        })
    }
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

function printMessage(message , textedBy){
    const msg = document.createElement('div');
    msg.innerText=`${textedBy} : ${message}`;
    chatDiv.appendChild(msg);
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

    showGroups.appendChild(newDiv);
}

function createSendButton(id){
    send.innerHTML=
    `<input type="text" id="text">
    <button class="send" id=${-id}>send</button>`
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