import { Filme } from "../model/filme.js";

class FilmeController {
    constructor() {
        this.listaFilmes = [];
        this.listaSessao = [];
        this.listaVenda = [];
        this.idEmEdicao = null;
        this.idParaExcluir = null;
        this.init();
    }

    init() {
        this.carregarSessaoVenda();

        // Botão do modal de adição
        const btnAdicionarFilme = document.querySelector('[data-bs-target="#modalAdicionarFilme"]');
        
        // Botão de salvar no modal
        const btnSalvar = document.querySelector('#modalAdicionarFilme .btn-primary');
        
        // Botão de buscar
        const btnBuscar = document.getElementById('btnBuscarFilme');
        
        // Botão de confirmar exclusão
        const btnConfirmarExcluir = document.getElementById('btnConfirmarExcluirFilme');

        btnAdicionarFilme.addEventListener('click', this.limparFormulario.bind(this));
        btnSalvar.addEventListener('click', this.salvar.bind(this));
        btnBuscar.addEventListener('click', this.buscarFilme.bind(this));
        btnConfirmarExcluir.addEventListener('click', this.excluir.bind(this));

        this.carregarFilmesDoLocalStorage();
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
        const filme = this.criarFilmeDoFormulario();

        if (this.idEmEdicao) {
            // Atualiza filme existente
            const index = this.listaFilmes.findIndex(f => f.id === this.idEmEdicao);
            this.listaFilmes[index] = filme;
        } else {
            // Adiciona novo filme
            this.listaFilmes.push(filme);
        }

        this.salvarNoLocalStorage();
        this.atualizarTabela();
        this.fecharModal('modalAdicionarFilme');
        this.limparFormulario();
    }
    validarFormulario() {
        const titulo = document.getElementById("inputTitulo").value.trim();
        const descricao = document.getElementById("inputDescricao").value.trim();
        const genero = document.getElementById("select-genero").value;
        const classificacao = document.getElementById("select-classificacao").value;
        const duracao = document.getElementById("inputDuracao").value.trim();
        const dataEstreia = document.getElementById("inputDataEstreia").value.trim();

        if (!titulo || !descricao || !genero || !classificacao || !duracao || !dataEstreia) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }
        if (isNaN(duracao) || duracao <= 0) {
            alert("A duração deve ser um número positivo.");
            return false;
        }
        if (new Date(dataEstreia) < new Date()) {
            alert("A data de estreia deve ser uma data futura.");
            return false;
        }
        if (new Date(dataEstreia) > new Date(new Date().setFullYear(new Date().getFullYear() + 100))) {
            alert("A data de estreia não pode ser mais de 100 anos no futuro.");
            return false;
        }
        return true;
    }

    criarFilmeDoFormulario() {
        return new Filme(
            this.idEmEdicao || Date.now(),
            document.getElementById("inputTitulo").value,
            document.getElementById("inputDescricao").value,
            document.getElementById("select-genero").options[document.getElementById("select-genero").selectedIndex].text,
            document.getElementById("select-classificacao").options[document.getElementById("select-classificacao").selectedIndex].text,
            document.getElementById("inputDuracao").value,
            document.getElementById("inputDataEstreia").value
        );
    }

    buscarFilme() {
        const termoBusca = document.getElementById('inputPesquisaTitulo').value.toLowerCase();
        
        if (!termoBusca) {
            this.atualizarTabela();
            return;
        }

        const filmesFiltrados = this.listaFilmes.filter(filme => 
            filme.titulo.toLowerCase().includes(termoBusca)
        );

        this.atualizarTabela(filmesFiltrados);
    }

    salvarNoLocalStorage() {
        localStorage.setItem("filmes", JSON.stringify(this.listaFilmes));
        localStorage.setItem("sessoes", JSON.stringify(this.listaSessao));
        localStorage.setItem("vendas", JSON.stringify(this.listaVenda));
    }

    carregarFilmesDoLocalStorage() {
        const filmesSalvos = localStorage.getItem("filmes");
        if (filmesSalvos) {
            this.listaFilmes = JSON.parse(filmesSalvos);
            this.atualizarTabela();
        }
    }

    atualizarTabela(filmes = this.listaFilmes) {
        const tbody = document.getElementById("tabelaFilmes");
        tbody.innerHTML = "";
    
        filmes.forEach(filme => {
            const tr = document.createElement("tr");
            tr.className = "table-dark";
            tr.innerHTML = `
                <td class="align-top">${filme.id}</td>
                <td class="align-top"><strong>${filme.titulo}</strong></td>
                <td class="align-top">${filme.descricao}</td>
                <td class="align-top">${filme.genero}</td>
                <td class="align-top">${filme.classificacao}</td>
                <td class="align-top">${filme.duracao}</td>
                <td class="align-top">${this.formatarData(filme.dataEstreia)}</td>
                <td class="align-top">
                    <button class="btn btn-warning btn-sm btn-editar customMenor-btn" data-id="${filme.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir customMenor-btn" data-id="${filme.id}">
                        Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
    
            // Adiciona eventos para os botões de editar e excluir
            tr.querySelector(".btn-editar").addEventListener("click", () => {
                const filmesLocal = JSON.parse(localStorage.getItem("filmes")) || [];
                const filmeParaEditar = filmesLocal.find(f => f.id === filme.id);
                if (filmeParaEditar) {
                    this.abrirModalEdicao(filmeParaEditar);
                }
            });
            
            tr.querySelector(".btn-excluir").addEventListener("click", () => this.prepararExclusao(filme));
        });
    }

    formatarDataParaInput(dataString) {
        if (!dataString) return '';
        
        // Se já estiver no formato YYYY-MM-DD, retorna direto
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
            return dataString;
        }
        
        // Converte de formato brasileiro (DD/MM/YYYY) para YYYY-MM-DD
        if (dataString.includes('/')) {
            const [dia, mes, ano] = dataString.split('/');
            return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
        
        // Tenta parsear como Date
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return '';
        
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    prepararExclusao(filme) {
        this.idParaExcluir = filme.id;
        this.nomeParaExcluir = filme.titulo;
        document.getElementById('filmeExcluirNome').textContent = filme.titulo;
        
        const modal = new bootstrap.Modal(document.getElementById('modalExcluirFilme'));
        modal.show();
    }

    excluir() {
        this.listaFilmes = this.listaFilmes.filter(filme => filme.id !== this.idParaExcluir);

        this.listaSessao = this.listaSessao.filter(sessao => sessao.filme !== this.nomeParaExcluir);

        this.listaVenda = this.listaVenda.filter(venda => !venda.sessao.includes(this.nomeParaExcluir));
        
        this.salvarNoLocalStorage();
        this.atualizarTabela();
        this.fecharModal('modalExcluirFilme');
    }

    abrirModalEdicao(filme) {
        // Busca os dados atualizados diretamente do LocalStorage
        const filmesSalvos = JSON.parse(localStorage.getItem("filmes")) || [];
        const filmeAtualizado = filmesSalvos.find(f => f.id === filme.id);
        
        if (!filmeAtualizado) {
            console.error("Filme não encontrado no LocalStorage");
            return;
        }
    
        this.idEmEdicao = filmeAtualizado.id;
        document.getElementById("inputTitulo").value = filmeAtualizado.titulo;
        document.getElementById("inputDescricao").value = filmeAtualizado.descricao || '';

        // Seleciona idioma
        const selectGenero = document.getElementById("select-genero");
        for (let i = 0; i < selectGenero.options.length; i++) {
            if (selectGenero.options[i].text === filme.genero) {
                selectGenero.selectedIndex = i;
                break;
            }
        }

        // Seleciona idioma
        const selectClassificacao = document.getElementById("select-genero");
        for (let i = 0; i < selectClassificacao.options.length; i++) {
            if (selectClassificacao.options[i].text === filme.classificacao) {
                selectClassificacao.selectedIndex = i;
                break;
            }
        }

        document.getElementById("inputDuracao").value = filmeAtualizado.duracao || '';
        document.getElementById("inputDataEstreia").value = this.formatarDataParaInput(filmeAtualizado.dataEstreia);
        
        // Atualiza o título do modal
        document.getElementById("modalAdicionarFilmeLabel").textContent = "Editar Filme";
        
        const modal = new bootstrap.Modal(document.getElementById('modalAdicionarFilme'));
        modal.show();
    }

    limparFormulario() {
        document.getElementById("inputTitulo").value = '';
        document.getElementById("inputDescricao").value = '';
        document.getElementById("inputClassificacao").value = '';
        document.getElementById("inputGenero").value = '';
        document.getElementById("inputDuracao").value = '';
        document.getElementById("inputDataEstreia").value = '';
        this.idEmEdicao = null;
    }

    fecharModal(modalId) {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
    }

    formatarData(data) {
        if (!data) return 'N/A';
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR");
    }
}

// Inicializa o controller quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    const filmeController = new FilmeController();
    window.filmeController = filmeController;
});