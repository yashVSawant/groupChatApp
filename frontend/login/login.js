const login = document.getElementById('login');

login.addEventListener('click',async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if(email&&password){  
        try{
            const postUserInfo = await axios.post('/user/login',{email, password});
            alert(postUserInfo.data.message);
            document.getElementById('email').value="";
            document.getElementById('password').value="";
            localStorage.setItem('grpChatappToken',postUserInfo.data.token);
            location.href='../chatHomePage/chatHomePage.html';
        }catch(err){
            alert(err.response.data.message)
        }
    }else{
        const showError = document.getElementById('showError');
        showError.innerText='please fill all fields';
        setTimeout(()=>{
            showError.innerText='';
        },2000)
    }
})