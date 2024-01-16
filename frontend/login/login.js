const login = document.getElementById('login');

login.addEventListener('click',async(e)=>{
    e.preventDefault();
        try{
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log( email, password)
            const postUserInfo = await axios.post('/user/login',{email, password});
            alert(postUserInfo.data.message);
            localStorage.setItem('grpChatappToken',postUserInfo.data.token);
            location.href='../chatHomePage/chatHomePage.html';
        }catch(err){
            alert(err.response.data.message)
        }
})