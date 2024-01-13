const signup = document.getElementById('signup');

signup.addEventListener('click',async(e)=>{
    e.preventDefault();
        try{
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phoneNo = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            // console.log(name ,email, phoneNo, password)
            const postUserInfo = await axios.post('/user/signup',{name ,email, phoneNo, password});
            alert(postUserInfo.data.message);
            location.href='../login/index.html';
        }catch(err){
            alert(err.response.data.message);
        }
})