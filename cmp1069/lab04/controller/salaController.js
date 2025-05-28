import { Sala } from "../model/sala.js";

class SalaController {
    constructor() {
        this.listaSalas = [];
        this.listaSessao = [];
        this.listaVenda = [];
        this.idEmEdicao = null;
        this.idParaExcluir = null;
        this.init();
    }

    init() {
        this.carregarSessaoVenda();
        // Botão do modal de adição
        const btnAdicionarSala = document.querySelector('[data-bs-target="#modalAdicionarSala"]');
        
        // Botão de salvar no modal
        const btnSalvar = document.querySelector('#modalAdicionarSala .btn-primary');
        
        // Botão de buscar
        const btnBuscar = document.getElementById('botaoBuscarSala');
        
        // Botão de confirmar exclusão
        const btnConfirmarExcluir = document.getElementById('btnConfirmarExcluirSala');

        btnAdicionarSala.addEventListener('click', this.limparFormulario.bind(this));
        btnSalvar.addEventListener('click', this.salvar.bind(this));
        btnBuscar.addEventListener('click', this.buscarSala.bind(this));
        btnConfirmarExcluir.addEventListener('click', this.excluir.bind(this));

        this.carregarSalasDoLocalStorage();
    }

    carregarSessaoVenda() {
        try {
            const sessaoSalvos = localStorage.getItem("sessoes");
            if (sessaoSalvos) {
                this.listaSessao = JSON.parse(sessaoSalvos);
            }

            const vendaSalvas = localStorage.getItem("vendas");
            if (vendaSalvas) {
                this.listaVenda = JSON.parse(vendaSalvas);
            }
        } catch (error) {
            console.error('Erro ao carregar filmes e salas:', error);
        }
    }

    salvar() {
        if (!this.validarFormulario()) {
            return;
        }

        const sala = this.criarSalaDoFormulario();

        if (this.idEmEdicao) {
            // Atualiza sala existente
            const index = this.listaSalas.findIndex(s => s.id === this.idEmEdicao);
            if (index !== -1) {
                this.listaSalas[index] = sala;
            }
        } else {
            // Adiciona nova sala
            this.listaSalas.push(sala);
        }

        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalAdicionarSala');
            this.limparFormulario();
        } else {
            alert('Erro ao salvar os dados!');
        }
    }

    validarFormulario() {
        const nomeSala = document.getElementById("nomeSala").value.trim();
        const capacidade = document.getElementById("capacidadeSala").value.trim();
        const tipo = document.getElementById("select-tipo").value;
        
        if (!nomeSala) {
            alert('Por favor, informe o número/nome da sala');
            return false;
        }
        if (!capacidade || isNaN(capacidade)) {
            alert('Por favor, informe uma capacidade válida');
            return false;
        }
        if (tipo === "0") {
            alert('Por favor, selecione o tipo de sala');
            return false;
        }
        if (capacidade <= 0) {
            alert('A capacidade deve ser maior que zero');
            return false;
        }
        if (this.listaSalas.some(sala => sala.nomeSala === nomeSala && sala.id !== this.idEmEdicao)) {
            alert('Já existe uma sala com esse nome/número!');
            return false;
        }
        return true;
    }

    validarFormulario() {
        const nomeSala = document.getElementById("nomeSala").value.trim();
        const capacidade = document.getElementById("capacidadeSala").value.trim();

        if (!nomeSala) {
            alert('Por favor, informe o número/nome da sala');
            return false;
        }

        if (!capacidade || isNaN(capacidade)) {
            alert('Por favor, informe uma capacidade válida');
            return false;
        }

        return true;
    }

    criarSalaDoFormulario() {
        return new Sala(
            this.idEmEdicao || Date.now(),
            document.getElementById("nomeSala").value.trim(),
            parseInt(document.getElementById("capacidadeSala").value),
            document.getElementById("select-tipo").options[document.getElementById("select-tipo").selectedIndex].text
        );
    }

    buscarSala() {
        const termoBusca = document.getElementById('inputPesquisaTitulo').value.toLowerCase().trim();
        
        if (!termoBusca) {
            this.atualizarTabela();
            return;
        }

        const salasFiltradas = this.listaSalas.filter(sala => 
            sala.nomeSala.toLowerCase().includes(termoBusca)
        );

        this.atualizarTabela(salasFiltradas);
    }

    salvarNoLocalStorage() {
        try {
            localStorage.setItem("salas", JSON.stringify(this.listaSalas));
            localStorage.setItem("sessoes", JSON.stringify(this.listaSessao));
            localStorage.setItem("vendas", JSON.stringify(this.listaVenda));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no LocalStorage:', error);
            return false;
        }
    }

    carregarSalasDoLocalStorage() {
        try {
            const salasSalvas = localStorage.getItem("salas");
            if (salasSalvas) {
                this.listaSalas = JSON.parse(salasSalvas);
                this.atualizarTabela();
            }
        } catch (error) {
            console.error('Erro ao carregar do LocalStorage:', error);
            this.listaSalas = [];
        }
    }

    atualizarTabela(salas = this.listaSalas) {
        const tbody = document.getElementById("tabelaSalas");
        tbody.innerHTML = "";

        if (salas.length === 0) {
            tbody.innerHTML = `
                <tr class="table-dark">
                    <td colspan="4" class="text-center">Nenhuma sala encontrada</td>
                </tr>
            `;
            return;
        }

        salas.forEach(sala => {
            const tr = document.createElement("tr");
            tr.className = "table-dark";
            tr.innerHTML = `
                <td class="align-top">${sala.id}</td>
                <td class="align-top"><strong>${sala.nomeSala}</strong></td>
                <td class="align-top">${sala.capacidade}</td>
                <td class="align-top">${sala.tipo}</td>
                <td class="align-top">
                    <button class="btn btn-warning btn-sm btn-editar customMenor-btn" data-id="${sala.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir customMenor-btn" data-id="${sala.id}">
                        Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            tr.querySelector(".btn-editar").addEventListener("click", () => {
                this.abrirModalEdicao(sala);
            });
            
            tr.querySelector(".btn-excluir").addEventListener("click", () => {
                this.prepararExclusao(sala);
            });
        });
    }

    prepararExclusao(sala) {
        this.idParaExcluir = sala.id;
        this.nomeParaExcluir = sala.nomeSala;
        document.getElementById('salaExcluirSala').textContent = sala.nomeSala;
        const modal = new bootstrap.Modal(document.getElementById('modalExcluirSala'));
        modal.show();
    }

    excluir() {
        this.listaSalas = this.listaSalas.filter(sala => sala.id !== this.idParaExcluir);

        this.listaSessao = this.listaSessao.filter(sessao => sessao.sala !== this.nomeParaExcluir);

        this.listaVenda = this.listaVenda.filter(venda => !venda.sessao.includes(this.nomeParaExcluir));
        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalExcluirSala');
        } else {
            alert('Erro ao excluir a sala!');
        }
    }

    abrirModalEdicao(sala) {
        // Busca a versão mais recente da sala no LocalStorage
        const salasAtualizadas = JSON.parse(localStorage.getItem("salas")) || [];
        const salaAtualizada = salasAtualizadas.find(s => s.id === sala.id) || sala;

        this.idEmEdicao = salaAtualizada.id;
        document.getElementById("nomeSala").value = salaAtualizada.nomeSala;
        document.getElementById("capacidadeSala").value = salaAtualizada.capacidade;

        // Seleciona formato
        const selectTipo = document.getElementById("select-tipo");
        for (let i = 0; i < selectTipo.options.length; i++) {
            if (selectTipo.options[i].text === sala.tipo) {
                selectTipo.selectedIndex = i;
                break;
            }
        }

        // Atualiza o título do modal
        document.getElementById("modalAdicionarSalaLabel").textContent = "Editar Sala";
        
        const modal = new bootstrap.Modal(document.getElementById('modalAdicionarSala'));
        modal.show();
    }

    limparFormulario() {
        document.getElementById("nomeSala").value = '';
        document.getElementById("capacidadeSala").value = '';
        document.getElementById("select-tipo").value = 0;
        this.idEmEdicao = null;
        document.getElementById("modalAdicionarSalaLabel").textContent = "Salvar Sala";
    }

    fecharModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId)) || 
                     new bootstrap.Modal(document.getElementById(modalId));
        modal.hide();
    }
}

// Inicializa o controller quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    const salaController = new SalaController();
    window.salaController = salaController;
});