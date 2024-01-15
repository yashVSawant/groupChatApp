const submit = document.getElementById('submit');
const token = localStorage.getItem('grpChatappToken');

submit.addEventListener('click',async(e)=>{
    e.preventDefault()
    console.log(token)
    const email = document.getElementById('email').value;
    await axios.post(`/user/getResetPasswordMail`,{email},{headers:{'Authorization':token}})
})