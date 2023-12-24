const chatDiv = document.getElementById('chat');
const token = localStorage.getItem('grpChatappToken');
const send = document.getElementById('send');

window.addEventListener('DOMContentLoaded',async()=>{
    // const chats = await axios.get('http://localhost:3000/message/getMessages',{headers:{'Authorization':token}});
    // chats.data.chats.forEach((item)=>{
    //     printMessage(item.text ,item.User.name)
    //     // console.log(item)
    // })   
    let count =1;
    setInterval(async()=>{
        
        const chats = await axios.get(`http://localhost:3000/message/getMessages?count=${count}`,{headers:{'Authorization':token}});
        if(chats.data.success){
                chats.data.chats.forEach((item)=>{
                printMessage(item.text ,item.User.name)
                // console.log(item)
                }) 
                count = chats.data.totalMsg;
        }
           
    },1000)
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