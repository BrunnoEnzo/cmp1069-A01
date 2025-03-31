// Array para armazenar os alunos
const alunos = [];
let indiceEdicao = -1; // Armazena o índice do aluno sendo editado

class Aluno {
    constructor(nome, idade, curso, nota) {
        this._nome = nome;
        this._idade = idade;
        this._curso = curso;
        this._nota = nota;
    }
    
    // Getters e Setters
    getNome() {
        return this._nome;
    }
    setNome(nome) {
        this._nome = nome;
    }
    getIdade() {
        return this._idade;
    }
    setIdade(idade) {
        this._idade = idade;
    }
    getCurso() {
        return this._curso;
    }
    setCurso(curso) {
        this._curso = curso;
    }
    getNota() {
        return this._nota;
    }
    setNota(nota) {
        this._nota = nota;
    }
    
    isAprovado() {
        return this._nota >= 7;
    }
    
    toString() {
        return `Nome: ${this._nome}, Idade: ${this._idade}, Curso: ${this._curso}, Nota: ${this._nota}`;
    }
}

// Funções do sistema
const cadastrarAluno = () => {
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
    if (alunos.some(aluno => aluno.getNome() === nome && indiceEdicao === -1)) {
        alert("Aluno já cadastrado!");
        return;
    }

    if (indiceEdicao === -1) {
        // Cria um novo aluno e adiciona ao array
        const aluno = new Aluno(nome, idade, curso, nota);
        alunos.push(aluno);
        alert("Aluno cadastrado com sucesso!");
    } else {
        atualizarAluno();
    }

    atualizarTabela();
    limparCampos();
}

const atualizarAluno = () => {
    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const curso = document.getElementById("curso").value;
    const nota = parseFloat(document.getElementById("nota").value);

    alunos[indiceEdicao].setNome(nome);
    alunos[indiceEdicao].setIdade(idade);
    alunos[indiceEdicao].setCurso(curso);
    alunos[indiceEdicao].setNota(nota);
    
    indiceEdicao = -1;
    alert("Aluno alterado com sucesso!");
    document.getElementById("btnCadastrar").value = "Cadastrar";
    atualizarTabela();
    limparCampos();
}

const retornarAluno = function(index) {
    document.getElementById("nome").value = alunos[index].getNome();
    document.getElementById("idade").value = alunos[index].getIdade();
    document.getElementById("curso").value = alunos[index].getCurso();
    document.getElementById("nota").value = alunos[index].getNota();
    
    indiceEdicao = index;
    document.getElementById("btnCadastrar").value = "Atualizar";
}

const removerAluno = function(index) {
    alunos.splice(index, 1);
    atualizarTabela();
    alert("Aluno removido com sucesso!");
}

const atualizarTabela = () => {
    const tbody = document.getElementById("table");
    tbody.innerHTML = "";

    alunos.forEach((aluno, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${aluno.getNome()}</td>
            <td>${aluno.getIdade()}</td>
            <td>${aluno.getCurso()}</td>
            <td>${aluno.getNota().toFixed(2)}</td>
            <td><button class="btn-excluir" data-index="${index}">Excluir</button></td>
            <td><button class="btn-editar" data-index="${index}">Editar</button></td>
        `;

        tbody.appendChild(linha);
    });

    // Adiciona event listeners aos botões
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            removerAluno(parseInt(this.getAttribute('data-index')));
        });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            retornarAluno(parseInt(this.getAttribute('data-index')));
        });
    });
}

const limparCampos = () => {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("nota").value = "";
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botão Cadastrar/Atualizar
    document.getElementById("btnCadastrar").addEventListener('click', function(e) {
        e.preventDefault();
        cadastrarAluno();
    });

    // Previne o envio do formulário ao pressionar Enter
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
    });
});