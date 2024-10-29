document.addEventListener('DOMContentLoaded', async function(){
    const overlay = document.querySelector('#overlay');
    const modalCriar = document.querySelector('#modal');
    const btnCadastrarFuncionario = document.querySelector('#btn-criar');
    const btnFechar = document.querySelector('#btn-fechar')
    const nomeFuncionario = document.querySelector('#nome-funcionario').value;
    const idadeFuncionario = document.querySelector('#idade-funcionario').value;
    const salarioFuncionario = document.querySelector('#salario-funcionario').value;
    const departamentoFuncionario = document.querySelector('#departamento-funcionario').value;
    const formCadastrarFunc = document.querySelector('#form-add-func');

    const idEmpresa = localStorage.getItem('userId');
    const token = localStorage.getItem('token')

    const modalExibido = localStorage.getItem("modalExibido");
  if (modalExibido === "true") {
    overlay.style.display = "block";
    modal.style.display = "block";
  }

  btnCadastrarFuncionario.addEventListener("click", function () {
    overlay.style.display = "block";
    modalCriar.style.display = "block";
    localStorage.setItem("modalExibido", "true");
  });

  btnFechar.addEventListener("click", function () {
    fecharJanela(overlay, modalCriar, nomeFuncionario, idadeFuncionario,salarioFuncionario, departamentoFuncionario );
  });

  formCadastrarFunc.addEventListener('submit', async function(event){
    event.preventDefault();

    if (nomeFuncionario === "" || idadeFuncionario === "" || salarioFuncionario === "" || departamentoFuncionario ==="") {
        alert("Preencha todas as informações!");
        return;
      }
    
  })

  /*
  async function salvarFuncionarioBackend(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario, idFuncionario = null) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      alert("Erro: ID do usuário ou token não encontrado.");
      return null;
    }

    const data = {
      nome: nomeFuncionario,
      idade: idadeFuncionario,
      salario: salarioFuncionario,
      departamento: departamentoFuncionario
    };
    //LEMBRAR DE EDITAR AS ROTAS APOS O BACK ESTA FUNCIONANDO
    const url = idFuncionario
      ? `/api/add/${idFuncionario}`
      : "/api/editar";

    const method = groupId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const salvarFuncionario = await response.json();
      //LEMBRAR DE EDITAR  O ID DO FUNCIONARIO APOS O BACK ESTA FUNCIONANDO
      if (method === "POST" && salvarFuncionario.funcionario_id) {
        localStorage.setItem(
          `funcionarioID_${salvarFuncionario.funcionario_id}`,
          JSON.stringify(salvarFuncionario)
        );
      }

      return salvarFuncionario;
    } catch (error) {
      console.error("Erro ao salvar funcionario:", error);
      alert("Erro ao salvar funcionario: " + error.message);
      return null;
    }
  }
    */
  function criarFuncionario(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario, idFuncionario) {
    const tabelaFuncionarios = document.querySelector("#tabela-funcionarios tbody");

    // Cria uma nova linha (tr) para o funcionário
    const novaLinha = document.createElement("tr");
    novaLinha.className = "linha-funcionario";
    novaLinha.dataset.idFuncionario = idFuncionario;

    // Adiciona as células com as informações do funcionário
    novaLinha.innerHTML = `
        <td class="celula-tabela">${nomeFuncionario}</td>
        <td class="celula-tabela">${departamentoFuncionario}</td>
        <td class="celula-tabela">${idadeFuncionario}</td>
        <td class="celula-tabela">${salarioFuncionario}</td>
        <td class="celula-tabela">
            <button class="editar-funcionario" data-id="${idFuncionario}">
                <i class="fa-solid fa-pencil-alt"></i> Editar
            </button>
            <button class="excluir-funcionario" data-id="${idFuncionario}">
                <i class="fa-solid fa-trash"></i> Excluir
            </button>
        </td>
    `;

    // Adiciona a linha à tabela
    tabelaFuncionarios.appendChild(novaLinha);

    // Adiciona o evento de edição
    const botaoEditar = novaLinha.querySelector(".editar-funcionario");
    botaoEditar.addEventListener("click", function () {
        editarFuncionario(idFuncionario);
    });

    // Adiciona o evento de exclusão
    const botaoExcluir = novaLinha.querySelector(".excluir-funcionario");
    botaoExcluir.addEventListener("click", function () {
        exibirModalExcluir(idFuncionario);
    });
}
  function fecharJanela(overlay, modalCriar, nomeFuncionario, idadeFuncionario,salarioFuncionario, departamentoFuncionario) {
    nomeFuncionario.value = "";
    idadeFuncionario.value = "";
    salarioFuncionario = "";
    departamentoFuncionario = "";
    overlay.style.display = "none";
    modalCriar.style.display = "none";
    localStorage.setItem("modalExibido", "false");
  }


})