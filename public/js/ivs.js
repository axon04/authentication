const form = document.getElementById('frm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const _name = document.getElementById('name');
const msg = document.getElementById('msg');

form.addEventListener('submit', validateInput);

function validateInput(event){

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

username.addEventListener('keypress', (e)=>{
    if(e.key.match(/[^a-zA-Z0-9]/)){ e.preventDefault()}
});

password.addEventListener('keypress', (e)=>{
    if(e.key.match(/[ ]/)){ e.preventDefault()}
});

_name.addEventListener('keypress', (e)=>{
    if(e.key.match(/[^a-zA-Z ]/)){ e.preventDefault()}
});