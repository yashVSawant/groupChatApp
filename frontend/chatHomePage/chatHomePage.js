const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('send');

window.addEventListener('DOMContentLoaded',async()=>{
    const chats = await axios.get('http://localhost:3000/message/getMessages',{headers:{'Authorization':token}});
    chats.data.chats.forEach((item)=>{
        printMessage(item.text ,item.User.name)
        // console.log(item)
    })   
})

send.addEventListener('click',async()=>{
    const text = document.getElementById('text').value;
    const sendMsg = await axios.post('http://localhost:3000/message/postMessage',{text},{headers:{'Authorization':token}});
    console.log(sendMsg.data);
})


function printMessage(message , textedBy){
    const msg = document.createElement('div');
    msg.innerText=`${textedBy} : ${message}`;
    chatDiv.appendChild(msg);
}