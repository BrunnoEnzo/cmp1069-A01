// Array para armazenar os alunos
const alunos = [];
let indiceEdicao = -1; // Armazena o índice do aluno sendo editado

class Aluno {
    constructor(nome, idade, curso, nota) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.nota = nota;
    }
}

function cadastrarAluno() {
    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const curso = document.getElementById("curso").value;
    const nota = parseFloat(document.getElementById("nota").value);

    // Validação básica
    if (!nome || isNaN(idade) || !curso || isNaN(nota)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Verifica se o aluno já está cadastrado
    for (let i = 0; i < alunos.length; i++) {
        if (alunos[i].nome === nome) {
            alert("Aluno já cadastrado!");
            return;
        }
    }

    // Cria um novo aluno e adiciona ao array
    const aluno = new Aluno(nome, idade, curso, nota);
    alunos.push(aluno);
    alert("Aluno cadastrado com sucesso!");
}

function atualizarTabela() {
    const tabela = document.getElementById("table");
    tabela.innerHTML = ""; // Limpa a tabela antes de atualizar

    for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];
        const linha = document.createElement("tr");

        const colunaNome = document.createElement("td");
        colunaNome.textContent = aluno.nome;
        linha.appendChild(colunaNome);

        const colunaIdade = document.createElement("td");
        colunaIdade.textContent = aluno.idade;
        linha.appendChild(colunaIdade);

        const colunaCurso = document.createElement("td");
        colunaCurso.textContent = aluno.curso;
        linha.appendChild(colunaCurso);

        const colunaNota = document.createElement("td");
        colunaNota.textContent = aluno.nota.toFixed(2);
        linha.appendChild(colunaNota);

        // Coluna Excluir
        const colunaExcluir = document.createElement("td");
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = (function(index) {
            return function() {
                alunos.splice(index, 1);
                atualizarTabela();
            };
        })(i);
        colunaExcluir.appendChild(botaoExcluir);
        linha.appendChild(colunaExcluir);

        // Coluna Editar
        const colunaEditar = document.createElement("td"); 
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.onclick = (function(index) {
            return function() {
                document.getElementById("nome").value = alunos[index].nome;
                document.getElementById("idade").value = alunos[index].idade;
                document.getElementById("curso").value = alunos[index].curso;
                document.getElementById("nota").value = alunos[index].nota;
                
                indiceEdicao = index;
                document.getElementById("btnCadastrar").value = "Atualizar";
            };
        })(i);
        colunaEditar.appendChild(botaoEditar);
        linha.appendChild(colunaEditar);

        tabela.appendChild(linha);
    }
}
function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("nota").value = "";
}
document.getElementById("btnCadastrar").onclick = function () {
    if(indiceEdicao !== -1) {
        // Atualiza os dados do funcionário existente usando os setters
        alunos[indiceEdicao].nome = document.getElementById("nome").value;
        alunos[indiceEdicao].idade = parseInt(document.getElementById("idade").value);
        alunos[indiceEdicao].curso = document.getElementById("curso").value;
        alunos[indiceEdicao].nota = parseFloat(document.getElementById("nota").value);
        
        indiceEdicao = -1; // Reseta o índice de edição
        document.getElementById("btnCadastrar").value = "Cadastrar"; // Restaura o texto do botão
    }
    else {
        cadastrarAluno();
    }
    atualizarTabela();
    limparCampos();
};