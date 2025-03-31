class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
    }

    // Métodos de acesso (getters e setters)
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

    getCargo() {
        return this._cargo;
    }

    setCargo(cargo) {
        this._cargo = cargo;
    }

    getSalario() {
        return this._salario;
    }

    setSalario(salario) {
        this._salario = salario;
    }

    calcularSalarioAnual() {
        return this._salario * 12;
    }

    toString() {
        return `Nome: ${this._nome}, Idade: ${this._idade}, Cargo: ${this._cargo}, Salário: ${this._salario}`;
    }
}

// Array para armazenar os funcionários
const funcionarios = [];

// Função para adicionar funcionário
function cadastrarFuncionario() {

    for (let i = 0; i < funcionarios.length; i++) {
        if (funcionarios[i].getNome() === document.getElementById("nome").value) {
            alert("Funcionário já cadastrado!");
            return;
        }
    }

    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value;
    const salario = parseFloat(document.getElementById("salario").value);
    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);
    limparCampos();
}

document.getElementById("btnSalvar").onclick = function() {
    cadastrarFuncionario();
    atualizarTabela();
}
const limparCampos = () => {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("salario").value = "";
}


function atualizarTabela() {
    const tabela = document.getElementById("table");
    tabela.innerHTML = ""; // Limpa a tabela antes de atualizar

    for (let i = 0; i < funcionarios.length; i++) {
        const funcionario = funcionarios[i];
        const linha = document.createElement("tr");

        const colunaNome = document.createElement("td");
        colunaNome.textContent = funcionario.getNome();
        linha.appendChild(colunaNome);

        const colunaIdade = document.createElement("td");
        colunaIdade.textContent = funcionario.getIdade();
        linha.appendChild(colunaIdade);

        const colunaCargo = document.createElement("td");
        colunaCargo.textContent = funcionario.getCargo();
        linha.appendChild(colunaCargo);

        const colunaSalario = document.createElement("td");
        colunaSalario.textContent = funcionario.getSalario().toFixed(2);
        linha.appendChild(colunaSalario);

        tabela.appendChild(linha);
    }
}