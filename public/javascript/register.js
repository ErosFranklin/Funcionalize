document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#form-register');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const name = document.querySelector('#nome-empresa').value;
        const email = document.querySelector('#email-empresa').value;
        const password = document.querySelector('#password-empresa').value;
        const niche = document.querySelector('#nicho').value;

     
        if (name === '' || email === '' || password === '' || niche === '') {
            alert('Preencha todos os dados');
            return;
        }
        if (!validarEmail(email)) {
            alert("Email inválido!");
            return;
          }
        if (!validarSenha(password)) {
            alert("A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra.");
            return;
        }

        console.log('Alo');
        try {
            let data = {
                name: name,
                email: email,
                password: password,
                niche: niche
            };
            
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message);
                alert("Erro: " + errorData.message);
                return;
            }

            const responseData = await response.json();
            console.log('dados do servidor', responseData);
            window.location.href = '../views/login.html';
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.");
        }
    });
    function validarEmail(email) {
        var emailRegex =
          /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
        return emailRegex.test(email);
      }
    function validarSenha(password) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(password);
    }
});
