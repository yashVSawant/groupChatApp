const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('inputDiv');
const showGroups = document.getElementById('showGroups');
const createGroup = document.getElementById('createGroup');
const creatNewGroup = document.getElementById('creatNewGroup');


window.addEventListener('DOMContentLoaded',async()=>{ 
    try{   
        const groupsData = await axios.get('http://localhost:3000/message/getGroups',{headers:{'Authorization':token}});
        // console.log(groupsData)
        groupsData.data.groups.forEach((item)=>{
            // console.log(item);
            displayGroups(item.name,item.id);
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
        try{
            console.log(e.target.parentNode.id);
            const groupId = e.target.parentNode.id;
            createSendButton(groupId);
            // let oldChats =localStorage.getItem('chats');
            // let oldChatsArray = oldChats?JSON.parse(oldChats):[];
            // // console.log(oldChatsArray);
            // oldChatsArray.forEach((item)=>{
            //     printMessage(item.text ,item.User.name)
            //     // console.log(item)
            //     }) 
            // let lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
            // console.log(lastMsgId)
            // setInterval(async()=>{
            const chats = await axios.get(`http://localhost:3000/message/getMessages?lastMsgId=${-1}&groupId=${groupId}`,{headers:{'Authorization':token}});
            console.log(chats.data.groupChats)
            if(chats.data.success){
                    chats.data.groupChats.forEach((item)=>{
                    printMessage(item.text ,'yash')
                    // console.log(item.text)
                    }) 
                    
                    // oldChatsArray = oldChatsArray.concat(chats.data.chats)
                    // lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
                    // console.log('....>',oldChatsArray.length>10)
                    // while(oldChatsArray.length>10){
                    //     oldChatsArray.shift();
                    // }
                    // localStorage.setItem('chats',JSON.stringify(oldChatsArray))
            }
            
            
        // },1000)
        }catch(err){
            console.log(err);
        }

    }
})

function printMessage(message , textedBy){
    const msg = document.createElement('div');
    msg.innerText=`${textedBy} : ${message}`;
    chatDiv.appendChild(msg);
}

function displayGroups(name,id){
    const newDiv = document.createElement('div');
    newDiv.innerHTML=`<button class='group'>${name}</button>`;
    newDiv.id = id;

    showGroups.appendChild(newDiv);
}

function createSendButton(id){
    send.innerHTML=
    `<input type="text" id="text">
    <button class="send" id=${-id}>send</button>`
}