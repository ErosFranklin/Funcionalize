document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#form-login");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const email = document.querySelector("#email-empresa").value;
      const password = document.querySelector("#password-empresa").value;
  
      if (email === "" || password === "") {
        alert("Preencha todos os campos!");
        return;
      }
  
      if (!validarEmail(email)) {
        alert("Email inválido!");
        return;
      }
  
      if (!validarPassword(password)) {
        alert(
          "A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra."
        );
        return;
      }
  
      try {
        const responseData = await login(email, password);
        if (responseData && responseData.token) {
            localStorage.setItem("token", responseData.token);
            const decode = jwt_decode(responseData.token);
            const userId = decode.id;
            localStorage.setItem("userId", userId);
            window.location.href = '../views/pagina-funcionarios.html'
        } else {
            console.error("Erro ao realizar login.");
            alert("Erro ao realizar login.");
        }
      } catch (error) {
            console.error("Erro no processo de login:", error);
            alert(
            "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
            );
      }
    });
  
    async function login(email, password) {
      const url = `http://localhost:3000/api/auth/login`;
      const data = {
        email: email,
        password: password,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro no servidor:", errorData.message);
          return null;
        }
  
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Erro na requisição fetch:", error);
        throw new Error("Erro na requisição fetch.");
      }
    }
    function validarEmail(email) {
      var emailRegex =
        /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
      return emailRegex.test(email);
    }
  
    function validarPassword(password) {
      var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
      return passwordRegex.test(password);
    }
  });
  