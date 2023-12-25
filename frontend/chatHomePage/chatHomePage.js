const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('send');

window.addEventListener('DOMContentLoaded',async()=>{
    // const chats = await axios.get('http://localhost:3000/message/getMessages',{headers:{'Authorization':token}});
    // chats.data.chats.forEach((item)=>{
    //     printMessage(item.text ,item.User.name)
    //     // console.log(item)
    // })   
    let oldChats =localStorage.getItem('chats');
    let oldChatsArray = oldChats?JSON.parse(oldChats):[];
    console.log(oldChatsArray);
    oldChatsArray.forEach((item)=>{
        printMessage(item.text ,item.User.name)
        // console.log(item)
        }) 
    let lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
    console.log(lastMsgId)
    // setInterval(async()=>{
        const chats = await axios.get(`http://localhost:3000/message/getMessages?lastMsgId=${lastMsgId}`,{headers:{'Authorization':token}});
        console.log(chats.data.success)
        if(chats.data.success){
                chats.data.chats.forEach((item)=>{
                printMessage(item.text ,item.User.name)
                // console.log(item)
                }) 
                
                oldChatsArray = oldChatsArray.concat(chats.data.chats)
                lastMsgId =oldChatsArray.length!=0? oldChatsArray[oldChatsArray.length-1].id : -1;
                console.log('....>',oldChatsArray.length>10)
                while(oldChatsArray.length>10){
                    oldChatsArray.shift();
                }
                localStorage.setItem('chats',JSON.stringify(oldChatsArray))
        }
        
           
    // },1000)
})

send.addEventListener('click',async()=>{
    const text = document.getElementById('text').value;
    await axios.post('http://localhost:3000/message/postMessage',{text},{headers:{'Authorization':token}});
    
})


function printMessage(message , textedBy){
    const msg = document.createElement('div');
    msg.innerText=`${textedBy} : ${message}`;
    chatDiv.appendChild(msg);
}