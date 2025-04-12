import { Sessao } from "../model/sessao.js";

class SessaoController {
    constructor() {
        this.listaSessoes = [];
        this.listaFilmes = [];
        this.listaSalas = [];
        this.listaVenda = [];
        this.idEmEdicao = null;
        this.idParaExcluir = null;
        this.init();
    }

    init() {
        this.carregarFilmesESalasEVendas();

        
        const btnAdicionarSessao = document.getElementById('btn-adicionar-sessao');
        const btnSalvar = document.getElementById('btn-salvar');
        const btnBuscar = document.getElementById('btn-buscar');
        const btnConfirmarExcluir = document.getElementById('btnConfirmarExcluirSessao');

        btnAdicionarSessao.addEventListener('click', this.limparFormulario.bind(this));
        btnSalvar.addEventListener('click', this.salvar.bind(this));
        btnBuscar.addEventListener('click', this.buscarSessao.bind(this));
        btnConfirmarExcluir.addEventListener('click', this.excluir.bind(this));

        this.carregarSessoesDoLocalStorage();
        this.popularSelects();
    }


    carregarFilmesESalasEVendas() {
        try {
            const filmesSalvos = localStorage.getItem("filmes");
            if (filmesSalvos) {
                this.listaFilmes = JSON.parse(filmesSalvos);
            }

            const salasSalvas = localStorage.getItem("salas");
            if (salasSalvas) {
                this.listaSalas = JSON.parse(salasSalvas);
            }

            const vendaSalvas = localStorage.getItem("vendas");
            if (vendaSalvas) {
                this.listaVenda = JSON.parse(vendaSalvas);
            }
        } catch (error) {
            console.error('Erro ao carregar filmes e salas:', error);
        }
    }

    popularSelects() {
        const selectFilme = document.getElementById('select-filme');
        const selectSala = document.getElementById('select-sala');

        this.listaFilmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id;
            option.textContent = filme.titulo;
            selectFilme.appendChild(option);
        });

        this.listaSalas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = sala.nomeSala;
            selectSala.appendChild(option);
        });
    }

    salvar() {
        if (!this.validarFormulario()) {
            return;
        }

        const sessao = this.criarSessaoDoFormulario();

        if (this.idEmEdicao) {
            const index = this.listaSessoes.findIndex(s => s.id === this.idEmEdicao);
            if (index !== -1) {
                this.listaSessoes[index] = sessao;
            }
        } else {
            this.listaSessoes.push(sessao);
        }

        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalAdicionarSessao');
            this.limparFormulario();
        } else {
            alert('Erro ao salvar os dados!');
        }
    }

    validarFormulario() {
        const filmeSelect = document.getElementById("select-filme");
        const salaSelect = document.getElementById("select-sala");
        const dataHora = document.getElementById("input-data-hora").value;
        const preco = parseFloat(document.getElementById("input-preco-filme").value);
        const idiomaSelect = document.getElementById("select-idioma");
        const formatoSelect = document.getElementById("select-formato");
    
        if (!filmeSelect.value) {
            alert('Por favor, selecione um filme');
            return false;
        }
        if (!salaSelect.value) {
            alert('Por favor, selecione uma sala');
            return false;
        }
        if (!dataHora) {
            alert('Por favor, informe a data e hora');
            return false;
        }
        if (isNaN(preco) || preco <= 0) {  // Impede valores negativos
            alert('Por favor, informe um preço válido maior que zero');
            return false;
        }
        if (idiomaSelect.selectedIndex <= 0) {
            alert('Por favor, selecione o idioma');
            return false;
        }
        if (formatoSelect.selectedIndex <= 0) {
            alert('Por favor, selecione o formato');
            return false;
        }
        if(dataHora.split('T')[0] < new Date().toISOString().split('T')[0]) {
            alert('A data não pode ser anterior a hoje!');
            return false;
        }
        if(dataHora.split('T')[0] > new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString().split('T')[0]) {
            alert('A data não pode ser superior a 100 anos no futuro!');
            return false;
        }
        return true;
    }

    criarSessaoDoFormulario() {
        const filmeSelect = document.getElementById("select-filme");
        const salaSelect = document.getElementById("select-sala");
        const dataHora = document.getElementById("input-data-hora").value;
        const [data, hora] = dataHora.split('T');
        
        const filmeSelecionado = this.listaFilmes.find(f => f.id == filmeSelect.value);
        const salaSelecionada = this.listaSalas.find(s => s.id == salaSelect.value);
        
        const idioma = document.getElementById("select-idioma").options[document.getElementById("select-idioma").selectedIndex].text;
        const formato = document.getElementById("select-formato").options[document.getElementById("select-formato").selectedIndex].text;
        const preco = parseFloat(document.getElementById("input-preco-filme").value) || 0;

        return new Sessao(
            this.idEmEdicao || Date.now(),
            filmeSelecionado.titulo,
            salaSelecionada.nomeSala,
            data,
            hora,
            preco,
            idioma,
            formato
        );
    }

    buscarSessao() {
        const termoBusca = document.getElementById('inputPesquisaTitulo').value.toLowerCase().trim();
        
        if (!termoBusca) {
            this.atualizarTabela();
            return;
        }

        const sessoesFiltradas = this.listaSessoes.filter(sessao => 
            sessao.filme.toLowerCase().includes(termoBusca) ||
            sessao.sala.toLowerCase().includes(termoBusca)
        );

        this.atualizarTabela(sessoesFiltradas);
    }

    salvarNoLocalStorage() {
        try {
            localStorage.setItem("sessoes", JSON.stringify(this.listaSessoes));
            localStorage.setItem("vendas", JSON.stringify(this.listaVenda));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no LocalStorage:', error);
            return false;
        }
    }

    carregarSessoesDoLocalStorage() {
        try {
            const sessoesSalvas = localStorage.getItem("sessoes");
            if (sessoesSalvas) {
                this.listaSessoes = JSON.parse(sessoesSalvas);
                this.atualizarTabela();
            }
        } catch (error) {
            console.error('Erro ao carregar do LocalStorage:', error);
            this.listaSessoes = [];
        }
    }

    atualizarTabela(sessoes = this.listaSessoes) {
        const tbody = document.getElementById("tabela-corpo");
        tbody.innerHTML = "";

        if (sessoes.length === 0) {
            tbody.innerHTML = `
                <tr class="table-dark">
                    <td colspan="9" class="text-center">Nenhuma sessão encontrada</td>
                </tr>
            `;
            return;
        }

        sessoes.forEach(sessao => {
            const tr = document.createElement("tr");
            tr.className = "table-dark";
            tr.innerHTML = `
                <td class="align-top">${sessao.id}</td>
                <td class="align-top"><strong>${sessao.filme}</strong></td>
                <td class="align-top">${sessao.sala}</td>
                <td class="align-top">${this.formatarData(sessao.data)}</td>
                <td class="align-top">${sessao.horario}</td>
                <td class="align-top">R$ ${sessao.preco.toFixed(2)}</td>
                <td class="align-top">${sessao.idioma || 'N/A'}</td>
                <td class="align-top">${sessao.formato || 'N/A'}</td>
                <td class="align-top">
                    <button class="btn btn-warning btn-sm btn-editar customMenor-btn" data-id="${sessao.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir customMenor-btn" data-id="${sessao.id}">
                        Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            tr.querySelector(".btn-editar").addEventListener("click", () => {
                this.abrirModalEdicao(sessao);
            });
            
            tr.querySelector(".btn-excluir").addEventListener("click", () => {
                this.prepararExclusao(sessao);
            });
        });
    }

    prepararExclusao(sessao) {
        this.idParaExcluir = sessao.id;
        this.nomeParaExcluir = sessao.filme;
        document.getElementById('filmeExcluirSessao').textContent = `${sessao.filme} - ${sessao.sala}`;
        const modal = new bootstrap.Modal(document.getElementById('modalExcluirSessao'));
        modal.show();
    }

    excluir() {
        this.listaSessoes = this.listaSessoes.filter(sessao => sessao.id !== this.idParaExcluir);
        this.listaVenda = this.listaVenda.filter(venda => !venda.sessao.includes(this.nomeParaExcluir));
        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalExcluirSessao');
        } else {
            alert('Erro ao excluir a sessão!');
        }
    }

    abrirModalEdicao(sessao) {
        this.idEmEdicao = sessao.id;
        
        // Seleciona filme
        const selectFilme = document.getElementById("select-filme");
        for (let i = 0; i < selectFilme.options.length; i++) {
            if (selectFilme.options[i].text === sessao.filme) {
                selectFilme.selectedIndex = i;
                break;
            }
        }
        
        // Seleciona sala
        const selectSala = document.getElementById("select-sala");
        for (let i = 0; i < selectSala.options.length; i++) {
            if (selectSala.options[i].text === sessao.sala) {
                selectSala.selectedIndex = i;
                break;
            }
        }
        
        // Data e hora
        document.getElementById("input-data-hora").value = `${sessao.data}T${sessao.horario}`;
        
        // Preço (adicionado como propriedade extra)
        document.getElementById("input-preco-filme").value = sessao.preco || '';
        
        // Seleciona idioma
        const selectIdioma = document.getElementById("select-idioma");
        for (let i = 0; i < selectIdioma.options.length; i++) {
            if (selectIdioma.options[i].text === sessao.idioma) {
                selectIdioma.selectedIndex = i;
                break;
            }
        }
        
        // Seleciona formato
        const selectFormato = document.getElementById("select-formato");
        for (let i = 0; i < selectFormato.options.length; i++) {
            if (selectFormato.options[i].text === sessao.formato) {
                selectFormato.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById("modalAdicionarSessaoLabel").textContent = "Editar Sessão";
        const modal = new bootstrap.Modal(document.getElementById('modalAdicionarSessao'));
        modal.show();
    }

    limparFormulario() {
        document.getElementById("select-filme").selectedIndex = 0;
        document.getElementById("select-sala").selectedIndex = 0;
        document.getElementById("input-data-hora").value = '';
        document.getElementById("input-preco-filme").value = '';
        document.getElementById("select-idioma").selectedIndex = 0;
        document.getElementById("select-formato").selectedIndex = 0;
        this.idEmEdicao = null;
        document.getElementById("modalAdicionarSessaoLabel").textContent = "Salvar Sessão";
    }

    fecharModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId)) || 
                     new bootstrap.Modal(document.getElementById(modalId));
        modal.hide();
    }

    formatarData(data) {
        if (!data) return 'N/A';
        try {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch {
            return data;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sessaoController = new SessaoController();
    window.sessaoController = sessaoController;
});