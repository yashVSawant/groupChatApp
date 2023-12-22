const signup = document.getElementById('signup');

signup.addEventListener('click',async(e)=>{
    e.preventDefault();
        try{
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            console.log(name ,email, phone, password)
            const postUserInfo = await axios.post('http://localhost:3000/user/signup',{name ,email, phone, password});
            alert(postUserInfo.data.message);
            
        }catch(err){
            alert(err.response.data.message);
        }
})