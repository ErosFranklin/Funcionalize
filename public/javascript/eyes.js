function mostrarSenha(){
    var input = document.getElementById('password-empresa');
    var eyesbtt = document.getElementById('eyes');
    
    if(input.type === 'password' ){
        input.setAttribute('type','text');
        eyesbtt.classList.replace('fa-eye', 'fa-eye-slash');
    }
    else{
        input.setAttribute('type','password');
        eyesbtt.classList.replace('fa-eye-slash', 'fa-eye');
    }
}
function mostrarConfSenha(){
    var inputC = document.getElementById('password-empresa2');
    var eyesbttC = document.getElementById('eyes2');

    if(inputC.type === 'password'){
        inputC.setAttribute('type','text');
        eyesbttC.classList.replace('fa-eye', 'fa-eye-slash');
    }
    else{
        inputC.setAttribute('type','password');
        eyesbttC.classList.replace('fa-eye-slash', 'fa-eye');
    }
}