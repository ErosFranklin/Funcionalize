//DEIXEI ALGUNS COMENTARIOS PARA DEDUZIR O QUE CADA FUNCAO FAZ

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
  const confirmaExcluirModal = document.querySelector('#confirmaExcluirModal');
  const confirmaExcluirBotao = document.querySelector('#confirmar-excluir-btn');
  const cancelarExclusao = document.querySelector('#cancelar-exclusao');
  const confirmaEditarModal = document.querySelector('#confirmaEditarModal');
  const confirmaEditarBotao = document.querySelector('#btn-atualiza-funcionario');
  const cancelarEdicao = document.querySelector('#btn-fechar-edicao');
  const tabelaFuncionarios = document.querySelector('#tabela-funcionarios')


  const nomeEmpresa = document.querySelector('#nome-empresa');
  const nichoEmpresa = document.querySelector('#nicho-empresa')
  const idEmpresa = localStorage.getItem('userId');
  const token = localStorage.getItem('token');


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

//FUNCAO PARA CARREGAR OS DADOS DA EMPRESAa
  async function carregarDetalhesEmpresa() {
    document.getElementById("verificando").style.display = "flex";

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/${idEmpresa}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido");
      }

      const dados = await response.json();
      console.log("Dados recebidos:", dados);

      if (dados) {
        nomeEmpresa.textContent = dados.name;
        nichoEmpresa.textContent = dados.niche;
      } else {
        console.error("Dados do grupo não encontrados ou estão vazios.");
      }
    
      await carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao carregar detalhes do grupo:", error);
    } finally {
      document.getElementById("verificando").style.display = "none";
    }
}

//FUNCAO PARA CARREGAR OS FUNNCIONARIOS
async function carregarFuncionarios() {

    document.getElementById("verificando").style.display = "flex";
    document.getElementById("mensagem-erro").style.display = "none";
    document.getElementById("tabela-funcionarios").style.display = "none";

    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
      }

      const dadosFuncionarios = await response.json();
      console.log(dadosFuncionarios)
      if (Array.isArray(dadosFuncionarios) && dadosFuncionarios.length > 0) {
        document.getElementById("verificando").style.display = "none";
        document.getElementById("tabela-funcionarios").style.display = "table";
        atualizarTabela(dadosFuncionarios);
      } else {
        document.getElementById("verificando").style.display = "none";
        document.getElementById("mensagem-erro").style.display = "flex";
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      
    }
}

  formCadastrarFunc.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nomeFuncionario = document.getElementById('nome-funcionario').value;
    const idadeFuncionario = document.getElementById('idade-funcionario').value;
    const salarioFuncionario = document.getElementById('salario-funcionario').value;
    const departamentoFuncionario = document.getElementById('departamento-funcionario').value;

    if (nomeFuncionario === "" || idadeFuncionario === "" || salarioFuncionario === "" || departamentoFuncionario === "") {
        alert("Preencha todas as informações!");
        return;
    }
    if(verificarFuncionarios(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario)){
      alert("Esse funcionário(a) já está cadastrado(a)");
      return;
    }
    if(idadeFuncionario <= 18){
      alert("Idade inválida. O funcionário deve ser maior de 18 anos.");
      return;
    }
    

    try {
      const novoFuncionario = await salvarFuncionarioBackend(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario);
      console.log(novoFuncionario)

      if (novoFuncionario) {
        carregarFuncionarios();
        document.getElementById('nome-funcionario').value = "";
        document.getElementById('idade-funcionario').value = "";
        document.getElementById('salario-funcionario').value = "";
        document.getElementById('departamento-funcionario').value = "";
        fecharJanela(overlay, modalCriar, nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario);
      }
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
    }
});

// FUNCAO PARA SALVAR OS DADOS DOS FUNCIONARIOS NO BACK
  async function salvarFuncionarioBackend(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      alert("Erro: ID do usuário ou token não encontrado.");
      return null;
    }

    const data = {
      name: nomeFuncionario,
      age: idadeFuncionario,
      salary: salarioFuncionario,
      department: departamentoFuncionario
    };

    try {
      const response = await fetch(`http://localhost:3000/api/employees/`, {
        method: 'POST',
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
      localStorage.setItem(`funcionarioID_${salvarFuncionario.funcionario_id}`,JSON.stringify(salvarFuncionario));
      return salvarFuncionario;
    } catch (error) {
      console.error("Erro ao salvar funcionario:", error);
      alert("Erro ao salvar funcionario: " + error.message);
      return null;
    }
  }

//FUNCAO PARA ATUALIZAR A LINHAS DA TABELA
function atualizarTabela(dados) {
  funcionariosTabela = document.querySelector('.funcionarios-tabela')
  funcionariosTabela.innerHTML = "";
  dados.forEach((funcionario) => {
    if (funcionario._id && funcionario.name && funcionario.age && funcionario.salary && funcionario.department) {
      const linha = document.createElement("tr");
      linha.className = 'linha-funcionario'

      linha.innerHTML = `
                  <td class='funcionarioAcesso'>${funcionario.name}</td>
                  <td class='funcionarioAcesso'>${funcionario.age}</td>
                  <td class='funcionarioAcesso'>R$${funcionario.salary}</td>
                  <td class='funcionarioAcesso'>${funcionario.department}</td>
                  <td class='funcionarioAcesso'>
                    <button class="btnEditar" data-id="${funcionario._id}">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btnExcluir" data-id="${funcionario._id}">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
              `;
      funcionariosTabela.appendChild(linha);
    } else {
      console.error(
        "Item do array de alunos não está no formato esperado:",
        funcionario
      );
    }
  });
  adicionarListeners();
}

//FUNCAO QUE VERIFICA SE O ALGUM FUNCIONARIO JA ESTA CADASTRADO COM AQUELAS FUNCOES
function verificarFuncionarios(nome, idade, salario, departamento) {
  const funcionarios = Array.from(document.querySelectorAll("#tabela-funcionarios tbody .linha-funcionario"));
  console.log(funcionarios)

  return funcionarios.some(funcionario => {
      const nomeFuncionario = funcionario.querySelector("td:nth-child(1)").textContent.trim();
      const idadeFuncionario = funcionario.querySelector("td:nth-child(2)").textContent.trim();
      const salarioFuncionario = funcionario.querySelector("td:nth-child(3)").textContent.trim()
      const departamentoFuncionario = funcionario.querySelector("td:nth-child(4)").textContent.trim();

      console.log(nomeFuncionario, idadeFuncionario, salarioFuncionario, departamentoFuncionario)

      return nomeFuncionario === nome && idadeFuncionario === idade && salarioFuncionario === salario && departamentoFuncionario === departamento;
  });
}

//FUNCAO QUE "ESCUTA" OS BOTOES DE EXCLUIR E EDITAR
function adicionarListeners() {
  const btnEditar = document.querySelectorAll('.btnEditar');
  const btnExcluir = document.querySelectorAll('.btnExcluir');
  console.log('Botao clicadossss')

  btnEditar.forEach((botao) => {
    botao.addEventListener('click', function() {
      let id_funcionario_edita = this.dataset.id;
      exibirModalEditarFuncionario(id_funcionario_edita);
      console.log("id funcionario antes da edicao:", id_funcionario_edita)
      carregarDadosFuncionario(id_funcionario_edita)
    });
  });

  btnExcluir.forEach((botao) => {
    console.log('Botao clicado')
    botao.addEventListener('click', function() {
      let id_funcionario_excluir = this.dataset.id;
      exibirModalExcluir(id_funcionario_excluir);
      
    });
  });
}

//FUNCAO APRA EXCLUIR UM FUNCIONARIO
async function excluirFuncionario(id) {
  const token = localStorage.getItem("token");

  if (!id || !token) {
    console.error("Erro: ID do funcionario ou token não encontrado.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/employees/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const linhaParaRemover = document.querySelector(`tr[data-idFuncionario="${id}"]`);
    if (linhaParaRemover) {
      linhaParaRemover.remove();
    }
    await carregarFuncionarios();
    localStorage.removeItem(`funcionarioID_${id}`);
    console.log("Funcionário excluído com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);
  }
}

//FUNCAO PARA ATUALIZAR INFORMACOES DO FUNCIONARIO
async function atualizarFuncionario(id) {
  const token = localStorage.getItem("token");
  const formEdit = document.querySelector("#form-edit-func");

  if (!id || !token) {
    console.error("Erro: ID do funcionário ou token não encontrado.");
    return;
  }

  const submitHandler = async function(event) {
    event.preventDefault();

    const novoNome = document.querySelector('#novo-nome-funcionario').value;
    const novaIdade = document.querySelector('#novo-idade-funcionario').value;
    const novoSalario = document.querySelector('#novo-salario-funcionario').value;
    const novoDepartamento = document.querySelector('#novo-departamento-funcionario').value;

    const dados = {
      name: novoNome,
      age: novaIdade,
      salary: novoSalario,
      department: novoDepartamento 
    };

    try {
      console.log(dados)
      const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await response.json();
      await carregarFuncionarios();
      alert("Funcionário atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao tentar atualizar funcionário:", error);
      alert("Erro ao atualizar funcionário: " + error.message);
    }
  };

  formEdit.removeEventListener('submit', submitHandler);
  formEdit.addEventListener('submit', submitHandler);
}

//FUNCAO QUE CARREGA OS DADOS DO FUNCIONARIO QUE SERA ATUALIZADO
async function carregarDadosFuncionario(id){
  const token = localStorage.getItem("token");
  
  try {
    const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const funcionario = await response.json();

    document.querySelector('#novo-nome-funcionario').value = funcionario.name;
    document.querySelector('#novo-idade-funcionario').value = funcionario.age;
    document.querySelector('#novo-salario-funcionario').value = funcionario.salary;
    document.querySelector('#novo-departamento-funcionario').value = funcionario.department;

  } catch (error) {
    console.error("Erro ao carregar os dados do funcionário:", error);
    alert("Erro ao carregar os dados do funcionário: " + error.message);
  }
}

//FUNCOES DE MODALS
function fecharJanela(overlay, modalCriar, nomeFuncionario, idadeFuncionario,salarioFuncionario, departamentoFuncionario) {
  nomeFuncionario.value = "";
  idadeFuncionario.value = "";
  salarioFuncionario = "";
  departamentoFuncionario = "";
  overlay.style.display = "none";
  modalCriar.style.display = "none";
  localStorage.setItem("modalExibido", "false");
}
function exibirModalExcluir(id) {
  id_funcionario_excluir = id
  overlay.style.display = "block";
  confirmaExcluirModal.style.display = "block";
}
function exibirModalEditarFuncionario(id) {
  
  id_funcionario_edita = id
  console.log("id durante a exibicao de modal:", id_funcionario_edita)
  overlay.style.display = "block";
  confirmaEditarModal.style.display = "block";
}
function fecharModalExclusao() {
  overlay.style.display = "none";
  confirmaExcluirModal.style.display = "none";
}
function fecharModalEdicao() {
  overlay.style.display = "none";
  confirmaEditarModal.style.display = "none";
}
confirmaEditarBotao.addEventListener('click', function(){
  console.log("id pos edicao:", id_funcionario_edita)
  if(id_funcionario_edita){
    atualizarFuncionario(id_funcionario_edita);
    fecharModalEdicao();
  }
})
cancelarEdicao.addEventListener("click", function(){
  fecharModalEdicao();
})
confirmaExcluirBotao.addEventListener("click", function () {
  if (id_funcionario_excluir) {
    excluirFuncionario(id_funcionario_excluir);
    fecharModalExclusao();
  }
});
cancelarExclusao.addEventListener("click", function () {
  fecharModalExclusao();
});
carregarDetalhesEmpresa()


})