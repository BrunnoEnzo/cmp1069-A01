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
    const nome = document.getElementById("nome").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const idade = parseInt(document.getElementById("idade").value);
    const salario = parseFloat(document.getElementById("salario").value);

    if (!nome || !cargo || isNaN(idade) || isNaN(salario) || idade <= 0 || salario <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    for (let i = 0; i < funcionarios.length; i++) {
        if (funcionarios[i].getNome() === nome && funcionarios[i].getCargo() === cargo) {
            alert("Funcionário já cadastrado!");
            return;
        }
    }

    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);

    console.log(funcionario.toString());
};

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
    gerarRelatorios();
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

        const colunaExcluir = document.createElement("td");
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = () => removerFuncionario(i);
        colunaExcluir.appendChild(botaoExcluir);
        linha.appendChild(colunaExcluir);

        const colunaEditar = document.createElement("td");
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.onclick = () => retornarFuncionario(i);
        colunaEditar.appendChild(botaoEditar);
        linha.appendChild(colunaEditar);

        tabela.appendChild(linha);
    }
};

// Função para exibir resultados na div
const mostrarResultado = (titulo, conteudo) => {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<h4>${titulo}</h4>${conteudo}`;
};

// Botão 1: Ganham acima de R$5000
document.querySelector('.relatorios button:nth-child(2)').addEventListener('click', () => {
    if (funcionarios.length === 0) {
        mostrarResultado('Média Salarial', 'Nenhum funcionário cadastrado');
        return;
    }
    const funcionariosFiltrados = funcionarios.filter(func => func.getSalario() > 5000);
    const conteudo = funcionariosFiltrados.length > 0 
        ? funcionariosFiltrados.map(func => 
            `${func.getNome()} - R$${func.getSalario().toFixed(2)}`).join('<br>')
        : 'Nenhum funcionário com salário acima de R$5000';
    
    mostrarResultado('Funcionários com salário > R$5000', conteudo);
});

// Botão 2: Média salarial
document.querySelector('.relatorios button:nth-child(3)').addEventListener('click', () => {
    if (funcionarios.length === 0) {
        mostrarResultado('Média Salarial', 'Nenhum funcionário cadastrado');
        return;
    }
    
    const media = funcionarios.reduce((acc, func) => acc + func.getSalario(), 0) / funcionarios.length;
    mostrarResultado('Média Salarial', `R$${media.toFixed(2)}`);
});

// Botão 3: Cargos únicos
document.querySelector('.relatorios button:nth-child(4)').addEventListener('click', () => {
    if (funcionarios.length === 0) {
        mostrarResultado('Média Salarial', 'Nenhum funcionário cadastrado');
        return;
    }
    const cargosUnicos = [...new Set(funcionarios.map(func => func.getCargo()))];
    mostrarResultado(
        'Cargos Únicos', 
        cargosUnicos.length > 0 ? cargosUnicos.join('<br>') : 'Nenhum cargo cadastrado'
    );
});

// Botão 4: Lista de nomes em maiúsculo
document.querySelector('.relatorios button:nth-child(5)').addEventListener('click', () => {
    if (funcionarios.length === 0) {
        mostrarResultado('Média Salarial', 'Nenhum funcionário cadastrado');
        return;
    }
    const nomesMaiusculos = funcionarios.map(func => func.getNome().toUpperCase());
    mostrarResultado(
        'Nomes em Maiúsculo',
        nomesMaiusculos.length > 0 ? nomesMaiusculos.join('<br>') : 'Nenhum nome cadastrado'
    );
});