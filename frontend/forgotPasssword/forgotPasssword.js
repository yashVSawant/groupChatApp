const submit = document.getElementById('submit');
const host ='http://localhost:3000'
const token = localStorage.getItem('grpChatappToken');

submit.addEventListener('click',async(e)=>{
    e.preventDefault()
    console.log(token)
    const email = document.getElementById('email').value;
    await axios.post(`${host}/user/getResetPasswordMail`,{email},{headers:{'Authorization':token}})
})