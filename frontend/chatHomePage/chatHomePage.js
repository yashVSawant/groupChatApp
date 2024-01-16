const socket = io();
const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('inputDiv');
const showGroups = document.getElementById('showGroups');
const createGroup = document.getElementById('createGroup');
const creatNewGroup = document.getElementById('creatNewGroup');
const add = document.getElementById('add');
const addNewMember = document.getElementById('addNewMember');
const backFromMember = document.getElementById('backFromMember');
const backFromAdd = document.getElementById('backFromAdd');
const backFromCreate = document.getElementById('backFromCreate');
const requests = document.getElementById('requests');
const backFromChat = document.getElementById('backFromChat');
const logout = document.getElementById('logout');

let oldChatsArray;

async function setUserNumber(){
    const userPhoneNo = await axios.get(`/user/getPhoneNo`,{headers:{'Authorization':token}});
    // console.log(userPhoneNo.data.userPhoneNo);
    localStorage.setItem('userPhoneNo',userPhoneNo.data.userPhoneNo)
    socket.emit('join-phoneNo',(userPhoneNo.data.userPhoneNo))
}
setUserNumber();

socket.on('connect',()=>{
    console.log(`connected with ${socket.id}`);
})

socket.on('recive-message',(groupId)=>{
    console.log(groupId)
    if(chatDiv.classList.value == groupId){
        const lastMsgId = getLastMsgId(groupId);
        console.log(lastMsgId);
        
        displayMessage(groupId,lastMsgId);
        
        // console.log('okay')
    }else{
        console.log(groupId);
        const groupDiv = document.getElementById(`${groupId}`);
        groupDiv.style.backgroundColor='red'
    }
})

socket.on('phone-no',(groupId)=>{
    console.log(">>>>",groupId);
    requests.style.backgroundColor='red'
})

window.addEventListener('DOMContentLoaded',async()=>{ 
    try{           
        const groupsData = await axios.get(`/group/getGroups`,{headers:{'Authorization':token}});
        // console.log(groupsData)
        groupsData.data.groups.forEach((item)=>{
            // console.log(item.group.name,item.group.id,item.isAdmin);
            displayGroups(item.group.name,item.group.id,item.isAdmin);
            const groupId = item.group.id;
            socket.emit('join-group',groupId);
        })
    }catch(err){
        console.log(err);
    }
})

send.addEventListener('click',async(e)=>{

    if(e.target.classList.contains('send')){
        try{
            const groupId = -1*(e.target.id);
            // console.log('>>>>>',groupId)
            const text = document.getElementById('text').value;
            const file = document.getElementById('file').files[0];
        //    console.log(file);
        
            if(!file && text){
                await axios.post(`/message/postMessage`,{text,groupId},{headers:{'Authorization':token}});
                updateChange();
            }
            
            if(file){
                // console.log('>>>>>',file)
                    const MIME_TYPE = "image/jpeg";
                    const QUALITY = 0.85;
                    const blobURL = URL.createObjectURL(file);
                    const img = new Image();
                    img.src = blobURL;
                    img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, 320, 180);
                    URL.revokeObjectURL(this.src);
                        canvas.toBlob(
                            async(blob) => {
                                // console.log(blob)
                                const formData = new FormData();
                                formData.append('groupId', groupId);
                                formData.append('file', blob);
                                formData.append('text', text);
                                await axios.post(`/message/postFile`,formData,{headers:{'Authorization':token,'Content-Type': 'multipart/form-data'},'enctype':"multipart/form-data"});
                                updateChange();
                            },
                            MIME_TYPE,
                            QUALITY
                        );
                    }
                    
            }
            async function updateChange(){
                document.getElementById('text').value ='';
                document.getElementById('file').value='';
                await socket.emit('send-message',groupId);
                const lastMsgId = getLastMsgId(groupId);
                console.log(lastMsgId);
                displayMessage(groupId,lastMsgId);
            }
        }catch(err){
            document.getElementById('text').value ='';
            document.getElementById('file').value='';
            console.log(err);
        }
    }
    
})
createGroup.addEventListener('click',()=>{
    const mainDiv = document.getElementById('div');
    const newGroup = document.getElementById('newGroup');

    mainDiv.style.display='none';
    newGroup.style.display='inline';
})

creatNewGroup.addEventListener('click',async()=>{
    try{
        const name = document.getElementById('groupName').value;
        const getGroup = await axios.post(`/group/createGroup`,{name},{headers:{'Authorization':token}});
        // console.log();
        displayGroups(name,getGroup.data.group.groupId,getGroup.data.group.isAdmin)
        alert('group is created successfully');
        const mainDiv = document.getElementById('div');
        const newGroup = document.getElementById('newGroup');

        mainDiv.style.display='flex';
        newGroup.style.display='none';

    }catch(err){
        console.log(err)
        alert('Error something went wrong');
    }

})
// individual groups features
showGroups.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('group')){
        const container = document.getElementById('container');
        const groupsDiv = document.getElementById('groupsDiv');
        const nav = document.getElementById('nav');
        nav.style.display='none'
        groupsDiv.style.display='none'
        container.style.display='flex'
        try{
            const groupId = e.target.parentNode.parentNode.id;
            const groupDiv = document.getElementById(`${groupId}`);
            groupDiv.style.backgroundColor='white'
            document.getElementById('headName').innerText=`${e.target.parentNode.childNodes[0].innerText}`;
            chatDiv.className=`${groupId}`
            createSendButton(groupId);
            document.getElementById('chat').innerHTML=''
            //  localStorage.setItem(`chats${groupId}`,'');
            const firstMsgId = getFirstMsg(groupId);
            displayLocalStorageMsg(groupId);
            const lastMsgId = getLastMsgId(groupId);
            // console.log(lastMsgId,groupId)
            displayMessage(groupId,lastMsgId);
        }catch(err){
            console.log(err);
        }

    }else if(e.target.classList.contains('members')){
        const groupId = e.target.parentNode.id;
        localStorage.setItem("selectedGroupId",groupId);
        localStorage.setItem("selectedGroupName",e.target.parentNode.childNodes[0].innerText);
        location.href="../profile/profile.html"
    }
})
// opnening showRequest div
requests.addEventListener('click',async()=>{
   location.href="../requests/request.html";
})

backFromCreate.addEventListener('click',()=>{
    const newGroup = document.getElementById('newGroup');
    back(newGroup);
})
backFromChat.addEventListener('click',()=>{
        const container = document.getElementById('container');
        const groupsDiv = document.getElementById('groupsDiv');
        const nav = document.getElementById('nav');
        nav.style.display='flex'
        groupsDiv.style.display='flex'
        container.style.display='none'
})
logout.addEventListener('click',()=>{
    localStorage.removeItem('grpChatappToken');
    location.href='../login/index.html'
})


// come back
function back(getDiv){
    
    const mainDiv = document.getElementById('div');
    mainDiv.style.display='flex';
    getDiv.style.display='none';
}
function displayLocalStorageMsg(groupId){
    let oldChats =localStorage.getItem(`chats${groupId}`);
            
            oldChatsArray = oldChats?JSON.parse(oldChats):[];
            //  console.log(oldChatsArray);
            oldChatsArray.forEach((item)=>{
                if(!item.imageUrl){
                    printMessage(item.text ,item.user.phoneNo, item.id);
                    // console.log(item)
                }else{
                    displayImage(item.imageUrl ,item.user.phoneNo ,item.text , item.id);
                } 
                makeCenter();
            })
}
//  print message
function printMessage(message , textedBy ,id){
    // console.log(id);
    const no = localStorage.getItem('userPhoneNo');
    const msg = document.createElement('div');
    if(no === textedBy){
        msg.innerHTML=`<div class='message' id='${id}'>${message}</div>`;
        msg.style.justifyContent='flex-end'
    }else{
        msg.innerHTML=`<div class='message' id='${id}'>${textedBy} : ${message}</div>`;
    }
    chatDiv.appendChild(msg);
    // console.log(chatDiv.classList.value)
}
// display image
function displayImage(imageUrl,textedBy ,text ,id){
    // console.log(id)
    const no = localStorage.getItem('userPhoneNo');
    const msg = document.createElement('div');
    if(no === textedBy){
        msg.innerHTML=`<div><img  class='message' id='${id}' src="${imageUrl}" alt="image" width="250" height="220">${text}</div>`;
        msg.style.justifyContent='flex-end'
    }else{
        msg.innerHTML=`<div>${textedBy} : <img  class='message' id='${id}' src="${imageUrl}" alt="image" width="200" height="170"></div>`;
    }
    chatDiv.appendChild(msg);
}

// show users groups
function displayGroups(name,id, isAdmin){
    // console.log(isAdmin);
    const newDiv = document.createElement('div');
        newDiv.innerHTML=`<div><button class='group'>${name}</button><div></div></div>
        <button class='members'>></button>`;
    newDiv.id = id;
    newDiv.className='groupDiv'
    newDiv.style.backgroundColor='white'
    showGroups.appendChild(newDiv);
}
// creating send button
function createSendButton(id){
    send.innerHTML=
    `
    <input type="text" id="text">
    <input type="file" id="file" name="file" multiple="multiple" accept="image/*,video/*">
    <button type='submit' class="send" id=${-id}>send</button>
    `
}

// show message
async function displayMessage(groupId,lastMsgId){
    
    //  console.log(lastMsgId)
     const chats = await axios.get(`/message/getMessages?lastMsgId=${lastMsgId}&groupId=${groupId}`,{headers:{'Authorization':token}});
    //  console.log(chats.data.success);
     if(chats.data.success){
             chats.data.groupChats.forEach((item)=>{
                console.log(item);
                if(!item.imageUrl){
                    printMessage(item.text ,item.user.phoneNo,item.id );
                }else{
                    displayImage(item.imageUrl ,item.user.phoneNo ,item.text,item.id );
                }
             }) 
             
             oldChatsArray = oldChatsArray.concat(chats.data.groupChats)
             while(oldChatsArray.length>10){
                 oldChatsArray.shift();
             }
             localStorage.setItem(`chats${groupId}`,JSON.stringify(oldChatsArray));
             makeCenter();
     }
    //  localStorage.setItem(`chats${groupId}`,'');
}
// give last message id
function getLastMsgId(groupId){
    updateOldChatArray(groupId)
    const lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
    return lastMsgId;
}

function getFirstMsg(groupId){
    updateOldChatArray(groupId);
    const firstMsgId =oldChatsArray.length!=0? oldChatsArray[0].id : -1;
    return firstMsgId;
}

function makeCenter(){   
    chatDiv.scrollTop =chatDiv.scrollHeight;   
}

function updateOldChatArray(groupId){
    let oldChats =localStorage.getItem(`chats${groupId}`);
     
     oldChatsArray = oldChats?JSON.parse(oldChats):[];
}