class SessaoController {
    constructor() {
        this.listaSessoes = [];
        this.init();
    }

    init() {
        this.carregarSessoesDoLocalStorage();
        this.configurarBusca();
        this.atualizarTabela();
    }

    carregarSessoesDoLocalStorage() {
        try {
            const sessoesSalvas = localStorage.getItem("sessoes");
            if (sessoesSalvas) {
                this.listaSessoes = JSON.parse(sessoesSalvas);
                console.log('Sessões carregadas:', this.listaSessoes);
            }
        } catch (error) {
            console.error('Erro ao carregar sessões:', error);
        }
    }

    configurarBusca() {
        const buscarBtn = document.getElementById('buscar-btn');
        const inputBusca = document.getElementById('inputPesquisaTitulo');

        if (buscarBtn && inputBusca) {
            buscarBtn.addEventListener('click', () => this.buscarSessoes());
            inputBusca.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.buscarSessoes();
            });
        }
    }

    buscarSessoes() {
        const termo = document.getElementById('inputPesquisaTitulo').value.toLowerCase().trim();
        const sessoesFiltradas = termo 
            ? this.listaSessoes.filter(s => 
                s.filme.toLowerCase().includes(termo) || 
                s.sala.toLowerCase().includes(termo))
            : this.listaSessoes;
        
        this.atualizarTabela(sessoesFiltradas);
    }

    atualizarTabela(sessoes = this.listaSessoes) {
        const tbody = document.getElementById('sessao-lista');
        if (!tbody) return;

        tbody.innerHTML = sessoes.length === 0
            ? `
                <tr class="table-dark">
                    <td colspan="6" class="text-center">Nenhuma sessão encontrada</td>
                </tr>
              `
            : sessoes.map(sessao => `
                <tr class="table-dark">
                    <td class="align-top">${sessao.id}</td>
                    <td class="align-top"><strong>${sessao.filme}</strong></td>
                    <td class="align-top">${sessao.sala}</td>
                    <td class="align-top">${this.formatarData(sessao.data)}</td>
                    <td class="align-top">${sessao.horario}</td>
                    <td class="align-top">
                        <button class="btn btn-success btn-sm btn-comprar customMenor-btn" 
                                data-id="${sessao.id}"
                                data-filme="${sessao.filme}"
                                data-sala="${sessao.sala}">
                            Comprar
                        </button>
                    </td>
                </tr>
            `).join('');

        // Adicione os event listeners aos botões
        document.querySelectorAll('.btn-comprar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sessaoId = e.target.dataset.id;
                const filme = e.target.dataset.filme;
                const sala = e.target.dataset.sala;
                this.redirecionarParaVenda(sessaoId, filme, sala);
            });
        });
    }

    redirecionarParaVenda(sessaoId, filme, sala) {
        // Armazena os dados da sessão selecionada
        sessionStorage.setItem('sessaoSelecionada', JSON.stringify({
            id: sessaoId,
            filme: filme,
            sala: sala
        }));
        
        // Redireciona para a página de vendas
        window.location.href = 'venda-ingressos.html';
    }

    formatarData(dataString) {
        if (!dataString) return 'N/A';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new SessaoController();
});