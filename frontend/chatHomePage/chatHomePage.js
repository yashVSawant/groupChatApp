const chat = document.getElementById('chat');

window.addEventListener('DOMContentLoaded',async()=>{
for(let i=0 ;i<10 ;i++){
    printMessage('hiii');
}
    
})

function printMessage(message){
    const msg = document.createElement('div');
    msg.innerText=message;
    // console.log('....!')
    chat.appendChild(msg);
}