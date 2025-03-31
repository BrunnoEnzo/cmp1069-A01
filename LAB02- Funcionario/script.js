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
let indiceEdicao = -1; // Armazena o índice do funcionário sendo editado

// Função para adicionar funcionário
const cadastrarFuncionario = () => {
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    
    // Verifica se funcionário já existe
    for (let i = 0; i < funcionarios.length; i++) {
        if (funcionarios[i].getNome() === nome && funcionarios[i].getCargo() === cargo) {
            alert("Funcionário já cadastrado!");
            return;
        }
    }

    const idade = parseInt(document.getElementById("idade").value);
    const salario = parseFloat(document.getElementById("salario").value);
    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);

    console.log(funcionario.toString());
}

const atualizarFuncionario = () => {
    funcionarios[indiceEdicao].setNome(document.getElementById("nome").value);
    funcionarios[indiceEdicao].setIdade(parseInt(document.getElementById("idade").value));
    funcionarios[indiceEdicao].setCargo(document.getElementById("cargo").value);
    funcionarios[indiceEdicao].setSalario(parseFloat(document.getElementById("salario").value));
    
    indiceEdicao = -1;
    document.getElementById("btnSalvar").value = "Salvar";
}

document.getElementById("btnSalvar").onclick = function() {
    if(indiceEdicao !== -1) {
        atualizarFuncionario();
    }
    else {
        cadastrarFuncionario();
    }
    atualizarTabela();
    limparCampos();
}

const limparCampos = () => {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("salario").value = "";
}
const removerFuncionario = (index) => {
    funcionarios.splice(index, 1);
    atualizarTabela();
};
const retornarFuncionario = (index) => {
    document.getElementById("nome").value = funcionarios[index].getNome();
    document.getElementById("idade").value = funcionarios[index].getIdade();
    document.getElementById("cargo").value = funcionarios[index].getCargo();
    document.getElementById("salario").value = funcionarios[index].getSalario();
    
    indiceEdicao = index;
    document.getElementById("btnSalvar").value = "Atualizar";
};

const atualizarTabela = () => {
    const tabela = document.getElementById("table");
    tabela.innerHTML = "";

    for (let i = 0; i < funcionarios.length; i++) {
        const funcionario = funcionarios[i];
        const linha = document.createElement("tr");

        // Usando os getters corretamente (como funções)
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

        // Coluna Excluir
        const colunaExcluir = document.createElement("td");
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = () => removerFuncionario(i);
        colunaExcluir.appendChild(botaoExcluir);
        linha.appendChild(colunaExcluir);

        // Coluna Editar
        const colunaEditar = document.createElement("td"); 
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.onclick = () => retornarFuncionario(i);
        colunaEditar.appendChild(botaoEditar);
        linha.appendChild(colunaEditar);

        tabela.appendChild(linha);
    }
}