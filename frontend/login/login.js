const login = document.getElementById('login');

login.addEventListener('click',async(e)=>{
    e.preventDefault();
        try{
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log( email, phoneNo, password)
            const postUserInfo = await axios.post('http://localhost:3000/user/login',{email, password});
            alert(postUserInfo.data.message);
            
        }catch(err){
            alert(err.response.data.message);
        }
})