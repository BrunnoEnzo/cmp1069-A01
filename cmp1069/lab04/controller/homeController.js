class HomeController {
    constructor() {
        this.init();
    }

    init() {
        this.carregarDados();
    }

    carregarDados() {
        this.carregarTotalFilmes();
        this.carregarProximasSessoes();
        this.carregarVendasHoje();
    }

    carregarTotalFilmes() {
        try {
            const filmes = JSON.parse(localStorage.getItem("filmes") || []);
            document.getElementById('total-filmes').textContent = filmes.length;
        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
        }
    }

    carregarProximasSessoes() {
        try {
            const sessoes = JSON.parse(localStorage.getItem("sessoes") || []);
            const hoje = new Date().toISOString().split('T')[0];
            
            const proximas = sessoes
                .filter(s => s.data >= hoje)
                .slice(0, 3); // Limita a 3 resultados
            
            let quantidade = 0;
            const lista = document.getElementById('proximas-sessoes');
            lista.innerHTML = proximas.length > 0 
                ? proximas.map(s => {
                    quantidade++;
                    if (quantidade > 2) return '';
                    return `
                        <li class="mb-2 text-center">
                            <strong>${s.filme}</strong> (${s.sala})<br>
                            <small>${s.data} às ${s.horario}</small>
                        </li>
                    `;
                }).join('')
                : '<li>Nenhuma sessão agendada</li>';
        } catch (error) {
            console.error("Erro ao carregar sessões:", error);
        }
    }

    carregarVendasHoje() {
        try {
            const vendas = JSON.parse(localStorage.getItem("vendas") || []);
            const hoje = new Date().toLocaleDateString('pt-BR');
            
            const vendasHoje = vendas.filter(v => {
                const dataVenda = new Date(v.id).toLocaleDateString('pt-BR');
                return dataVenda === hoje;
            });

            document.getElementById('total-vendas').textContent = vendasHoje.length;
        } catch (error) {
            console.error("Erro ao carregar vendas:", error);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new HomeController();
});