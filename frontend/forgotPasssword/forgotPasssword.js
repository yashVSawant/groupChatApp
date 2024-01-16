const submit = document.getElementById('submit');
const token = localStorage.getItem('grpChatappToken');

submit.addEventListener('click',async(e)=>{
    e.preventDefault()
    console.log(token)
    const email = document.getElementById('email').value;
    if(email){ 
        try{
            await axios.post(`/user/getResetPasswordMail`,{email},{headers:{'Authorization':token}})
            document.getElementById('email').value='';
        }catch(err){
            alert('somthing went wrong!')
        }
    }else{
        const showError = document.getElementById('showError');
        showError.innerText='please enter something';
        setTimeout(()=>{
            showError.innerText='';
        },2000)
    }
})