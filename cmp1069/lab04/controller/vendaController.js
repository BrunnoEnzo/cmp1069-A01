import { Venda } from "../model/venda.js";

class VendaController {
    constructor() {
        this.listaVendas = [];
        this.listaSessoes = [];
        this.idEmEdicao = null;
        this.idParaExcluir = null;
        this.init();
    }

    init() {
        this.carregarSessoesDoLocalStorage();
        this.verificarSessaoSelecionada();
        
        const btnAdicionarVenda = document.getElementById('btn-adicionar-venda');
        const btnSalvar = document.getElementById('btn-salvar');
        const btnBuscar = document.getElementById('btn-buscar');
        const btnConfirmarExcluir = document.getElementById('btnConfirmarExcluirVenda');

        btnAdicionarVenda.addEventListener('click', this.limparFormulario.bind(this));
        btnSalvar.addEventListener('click', this.salvar.bind(this));
        btnBuscar.addEventListener('click', this.buscarVenda.bind(this));
        btnConfirmarExcluir.addEventListener('click', this.excluir.bind(this));

        this.carregarVendasDoLocalStorage();
        this.popularSelectSessoes();
    }
    verificarSessaoSelecionada() {
        const sessaoSelecionada = sessionStorage.getItem('sessaoSelecionada');
        if (sessaoSelecionada) {
            try {
                const { id, filme, sala } = JSON.parse(sessaoSelecionada);
                const selectSessao = document.getElementById('select-sessao');
                
                // Verifica se a opção já existe no select
                let existeOpcao = false;
                for (let i = 0; i < selectSessao.options.length; i++) {
                    if (selectSessao.options[i].value === id) {
                        selectSessao.selectedIndex = i;
                        existeOpcao = true;
                        break;
                    }
                }
                
                // Se não existe, cria uma nova opção
                if (!existeOpcao) {
                    const option = document.createElement('option');
                    option.value = id;
                    option.textContent = `${filme} - ${sala}`;
                    selectSessao.appendChild(option);
                    selectSessao.value = id;
                }
                
                // Abre o modal automaticamente
                const modal = new bootstrap.Modal(document.getElementById('modalAdicionarVenda'));
                modal.show();
                
            } catch (error) {
                console.error('Erro ao processar sessão selecionada:', error);
            } finally {
                // Remove o item do sessionStorage após usar
                sessionStorage.removeItem('sessaoSelecionada');
            }
        }
    }

    carregarSessoesDoLocalStorage() {
        try {
            const sessoesSalvas = localStorage.getItem("sessoes");
            if (sessoesSalvas) {
                this.listaSessoes = JSON.parse(sessoesSalvas);
            }
        } catch (error) {
            console.error('Erro ao carregar sessões:', error);
        }
    }

    popularSelectSessoes() {
        const selectSessao = document.getElementById('select-sessao');

        this.listaSessoes.forEach(sessao => {
            const option = document.createElement('option');
            option.value = sessao.id;
            option.textContent = `${sessao.filme} - ${sessao.sala}`;
            selectSessao.appendChild(option);
        });
    }

    salvar() {
        if (!this.validarFormulario()) {
            return;
        }

        const venda = this.criarVendaDoFormulario();

        if (this.idEmEdicao) {
            const index = this.listaVendas.findIndex(v => v.id === this.idEmEdicao);
            if (index !== -1) {
                this.listaVendas[index] = venda;
            }
        } else {
            this.listaVendas.push(venda);
        }

        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalAdicionarVenda');
            this.limparFormulario();
        } else {
            alert('Erro ao salvar os dados!');
        }
    }

    validarFormulario() {
        const sessaoSelect = document.getElementById("select-sessao");
        const nomeCliente = document.getElementById("nomeCliente").value.trim();
        const cpf = document.getElementById("cpfCliente").value.trim();
        const assento = document.getElementById("assento").value.trim();
        const tipoPagamentoSelect = document.getElementById("select-tipo-pagamento");

        if (sessaoSelect.selectedIndex <= 0) {
            alert('Por favor, selecione uma sessão');
            return false;
        }

        if (!nomeCliente) {
            alert('Por favor, informe o nome do cliente');
            return false;
        }

        if (!cpf || cpf.length !== 11) {
            alert('CPF deve conter 11 dígitos');
            return false;
        }

        if (!assento) {
            alert('Por favor, informe o assento');
            return false;
        }

        if (tipoPagamentoSelect.selectedIndex <= 0) {
            alert('Por favor, selecione o tipo de pagamento');
            return false;
        }

        return true;
    }

    criarVendaDoFormulario() {
        const sessaoSelect = document.getElementById("select-sessao");
        const sessaoSelecionada = this.listaSessoes.find(s => s.id == sessaoSelect.value);
        const tipoPagamento = document.getElementById("select-tipo-pagamento").options[document.getElementById("select-tipo-pagamento").selectedIndex].text;

        return new Venda(
            this.idEmEdicao || Date.now(),
            `${sessaoSelecionada.filme} - ${sessaoSelecionada.sala}`,
            document.getElementById("nomeCliente").value.trim(),
            document.getElementById("cpfCliente").value.trim(),
            document.getElementById("assento").value.trim(),
            tipoPagamento
        );
    }

    buscarVenda() {
        const inputBusca = document.getElementById('inputPesquisaTitulo');
        const termoBusca = inputBusca.value.toLowerCase().trim();
        
        if (!termoBusca) {
            this.atualizarTabela(); // Mostra todos se busca vazia
            return;
        }
    
        const vendasFiltradas = this.listaVendas.filter(venda => {
            return (
                venda.nomeCliente.toLowerCase().includes(termoBusca) ||
                venda.cpf.includes(termoBusca) ||
                venda.sessao.toLowerCase().includes(termoBusca)
            );
        });
    
        this.atualizarTabela(vendasFiltradas);
    }

    salvarNoLocalStorage() {
        try {
            localStorage.setItem("vendas", JSON.stringify(this.listaVendas));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no LocalStorage:', error);
            return false;
        }
    }

    carregarVendasDoLocalStorage() {
        try {
            const vendasSalvas = localStorage.getItem("vendas");
            if (vendasSalvas) {
                this.listaVendas = JSON.parse(vendasSalvas);
                this.atualizarTabela();
            }
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            this.listaVendas = [];
        }
    }

    atualizarTabela(vendas = this.listaVendas) {
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        if (vendas.length === 0) {
            tbody.innerHTML = `
                <tr class="table-dark">
                    <td colspan="7" class="text-center">Nenhuma venda encontrada</td>
                </tr>
            `;
            return;
        }

        vendas.forEach(venda => {
            const tr = document.createElement("tr");
            tr.className = "table-dark";
            tr.innerHTML = `
                <td class="align-top">${venda.id}</td>
                <td class="align-top"><strong>${venda.sessao}</strong></td>
                <td class="align-top">${venda.nomeCliente}</td>
                <td class="align-top">${this.formatarCPF(venda.cpf)}</td>
                <td class="align-top">${venda.assento}</td>
                <td class="align-top">${venda.tipoPagamento}</td>
                <td class="align-top">
                    <button class="btn btn-warning btn-sm btn-editar customMenor-btn" data-id="${venda.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir customMenor-btn" data-id="${venda.id}">
                        Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            tr.querySelector(".btn-editar").addEventListener("click", () => {
                this.abrirModalEdicao(venda);
            });
            
            tr.querySelector(".btn-excluir").addEventListener("click", () => {
                this.prepararExclusao(venda);
            });
        });
    }

    formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    prepararExclusao(venda) {
        this.idParaExcluir = venda.id;
        document.getElementById('filmeExcluirVenda').textContent = `${venda.sessao} - ${venda.nomeCliente}`;
        const modal = new bootstrap.Modal(document.getElementById('modalExcluirVenda'));
        modal.show();
    }

    excluir() {
        this.listaVendas = this.listaVendas.filter(venda => venda.id !== this.idParaExcluir);
        if (this.salvarNoLocalStorage()) {
            this.atualizarTabela();
            this.fecharModal('modalExcluirVenda');
        } else {
            alert('Erro ao excluir a venda!');
        }
    }

    abrirModalEdicao(venda) {
        this.idEmEdicao = venda.id;
        
        // Seleciona sessão
        const selectSessao = document.getElementById("select-sessao");
        for (let i = 0; i < selectSessao.options.length; i++) {
            if (selectSessao.options[i].text === venda.sessao) {
                selectSessao.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById("nomeCliente").value = venda.nomeCliente;
        document.getElementById("cpfCliente").value = venda.cpf;
        document.getElementById("assento").value = venda.assento;
        
        // Seleciona tipo de pagamento
        const selectPagamento = document.getElementById("select-tipo-pagamento");
        for (let i = 0; i < selectPagamento.options.length; i++) {
            if (selectPagamento.options[i].text === venda.tipoPagamento) {
                selectPagamento.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById("modalAdicionarVendaLabel").textContent = "Editar Venda";
        const modal = new bootstrap.Modal(document.getElementById('modalAdicionarVenda'));
        modal.show();
    }

    limparFormulario() {
        document.getElementById("select-sessao").selectedIndex = 0;
        document.getElementById("nomeCliente").value = '';
        document.getElementById("cpfCliente").value = '';
        document.getElementById("assento").value = '';
        document.getElementById("select-tipo-pagamento").selectedIndex = 0;
        this.idEmEdicao = null;
        document.getElementById("modalAdicionarVendaLabel").textContent = "Nova Venda";
    }

    fecharModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId)) || 
                     new bootstrap.Modal(document.getElementById(modalId));
        modal.hide();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const vendaController = new VendaController();
    window.vendaController = vendaController;
});