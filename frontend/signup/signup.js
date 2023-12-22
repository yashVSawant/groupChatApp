const signup = document.getElementById('signup');

signup.addEventListener('click',(e)=>{
    e.preventDefault();
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const password = document.getElementById('password');
        console.log(name.value , email.value , phone.value , password.value)
})