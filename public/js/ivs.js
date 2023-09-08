const form = document.getElementById('frm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const msg = document.getElementById('msg');

form.addEventListener('submit', validateInput);

function validateInput(event){
    
    if(username.value === '' || password.value === ''){ event.preventDefault(); }
    if(username.value.match(/[^a-zA-z0-9]/)){ 
        event.preventDefault(); 
        msg.innerHTML = 'Username can only contain alphabets and numbers';
    }
    
    if(username.value.length > 10 ){
        event.preventDefault();
        msg.innerHTML = 'Username is too long';
    }
    if(password.value.length < 8 ){
        event.preventDefault();
        msg.innerHTML = 'Password must contain at least 8 characters';
    }
    if(password.value.length > 20 ){
        event.preventDefault();
        msg.innerHTML = 'Password is too long';
    }
}