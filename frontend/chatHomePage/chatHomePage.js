const chat = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('send');

window.addEventListener('DOMContentLoaded',async()=>{
    console.log(token)
    printMessage('joined')
for(let i=0 ;i<10 ;i++){
    printMessage('hiii');
}
    
})

send.addEventListener('click',async()=>{
    const text = document.getElementById('text').value;
    const sendMsg = await axios.post('http://localhost:3000/message/postMessage',{text},{headers:{'Authorization':token}});
    console.log(sendMsg.data);
})


function printMessage(message){
    const msg = document.createElement('div');
    msg.innerText=message;
    // console.log('....!')
    chat.appendChild(msg);
}