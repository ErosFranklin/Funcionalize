document.addEventListener('DOMContentLoaded', function(){
    const formRegister = document.querySelector('#form-register')
    formRegister.addEventListener('Submit', function(event){
        event.defaultPrevented()

        const nome = document.querySelector('#nome-empresa')
        const email = document.querySelector('#email-empresa')
        const password = document.querySelector('#password-empresa')
        const niche = document.querySelector('#nicho')

        if(!nome === '' || !email === '' || password === '' || niche === ''){
            alert('Prencha todos os dados')
            return
        }
        if(!validarSenha(password)){
            alert(
                "A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra."
              );
            return;
        }

    })
    function validarSenha(password) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(password);
      }
})