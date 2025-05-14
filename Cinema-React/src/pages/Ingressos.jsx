import React, { useState, useEffect } from 'react';
import { Venda } from '../model/venda';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import InputText from '../components/Input/InputText';
import SelectInput from '../components/Input/SelectInput';
import SearchInput from '../components/Input/SearchInput';
import InputCpf from '../components/Input/InputCpf';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

function IngressoPage() {
    const [vendas, setVendas] = useState(() => {
        const vendasSalvas = localStorage.getItem('vendas');
        return vendasSalvas ? JSON.parse(vendasSalvas) : [];
    });
    const [sessoes, setSessoes] = useState([]);
    const [vendaEditando, setVendaEditando] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vendaParaExcluir, setVendaParaExcluir] = useState(null);
    const [formData, setFormData] = useState({
        sessao: '',
        nomeCliente: '',
        cpf: '',
        assento: '',
        tipoPagamento: ''
    });

    const tiposPagamento = [
        { value: '1', label: 'Cartão' },
        { value: '2', label: 'Pix' },
        { value: '3', label: 'Dinheiro' }
    ];

    // Carrega dados iniciais
    useEffect(() => {
        const carregarDados = () => {
            try {
                const sessoesSalvas = localStorage.getItem('sessoes');
                if (sessoesSalvas) setSessoes(JSON.parse(sessoesSalvas));

                // Verifica se há sessão selecionada no sessionStorage
                const sessaoSelecionada = sessionStorage.getItem('sessaoSelecionada');
                if (sessaoSelecionada) {
                    const { id, filme, sala } = JSON.parse(sessaoSelecionada);
                    setFormData(prev => ({
                        ...prev,
                        sessao: id
                    }));
                    setShowModal(true);
                    sessionStorage.removeItem('sessaoSelecionada');
                }
            } catch (error) {
                console.error('Erro ao carregar sessões:', error);
            }
        };
        carregarDados();
    }, []);

    // Salva no localStorage quando vendas mudam
    useEffect(() => {
        const salvarVendas = () => {
            try {
                localStorage.setItem('vendas', JSON.stringify(vendas));
            } catch (error) {
                console.error('Erro ao salvar vendas no localStorage:', error);
            }
        };
        salvarVendas();
    }, [vendas]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value // Já recebe o valor sem formatação do InputCpf
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const sessaoSelecionada = sessoes.find(s => s.id == formData.sessao);
        const tipoPagamento = tiposPagamento.find(t => t.value === formData.tipoPagamento)?.label;

        const novaVenda = new Venda(
            vendaEditando?.id || Date.now(),
            `${sessaoSelecionada.filme} - ${sessaoSelecionada.sala}`,
            formData.nomeCliente.trim(),
            formData.cpf.trim(),
            formData.assento.trim(),
            tipoPagamento
        );

        if (vendaEditando) {
            setVendas(vendas.map(v => v.id === vendaEditando.id ? novaVenda : v));
        } else {
            setVendas([...vendas, novaVenda]);
        }

        setShowModal(false);
        setVendaEditando(null);
        resetForm();
    };

    const validarFormulario = () => {
        if (!formData.sessao) {
            alert('Por favor, selecione uma sessão');
            return false;
        }

        if (!formData.nomeCliente.trim()) {
            alert('Por favor, informe o nome do cliente');
            return false;
        }

        if (!formData.cpf.trim() || formData.cpf.length !== 11 ) {
            if (formData.cpf.length === 11) {
                return false;
            }
            alert('CPF deve conter 11 dígitos');
            return false;
        }

        if (!formData.assento.trim()) {
            alert('Por favor, informe o assento');
            return false;
        }

        if (!formData.tipoPagamento) {
            alert('Por favor, selecione o tipo de pagamento');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            sessao: '',
            nomeCliente: '',
            cpf: '',
            assento: '',
            tipoPagamento: ''
        });
    };

    const prepararExclusao = (venda) => {
        setVendaParaExcluir(venda);
        setShowDeleteModal(true);
    };

    const confirmarExclusao = () => {
        setVendas(vendas.filter(v => v.id !== vendaParaExcluir.id));
        setShowDeleteModal(false);
        setVendaParaExcluir(null);
    };

    const abrirModalEdicao = (venda) => {
        setVendaEditando(venda);
        setFormData({
            sessao: sessoes.find(s => venda.sessao.includes(s.filme))?.id || '',
            nomeCliente: venda.nomeCliente,
            cpf: venda.cpf,
            assento: venda.assento,
            tipoPagamento: tiposPagamento.find(t => t.label === venda.tipoPagamento)?.value || ''
        });
        setShowModal(true);
    };

    const abrirModalAdicionar = () => {
        setVendaEditando(null);
        resetForm();
        setShowModal(true);
    };

    const vendasFiltradas = termoBusca
        ? vendas.filter(v =>
            v.nomeCliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
            v.cpf.includes(termoBusca) ||
            v.sessao.toLowerCase().includes(termoBusca.toLowerCase()))
        : vendas;

    const formatarCPF = (cpf) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    return (
        <div className="bg-dark text-light table-responsive" style={{ minHeight: "100vh", width: '100vw', boxSizing: "border-box" }}>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Venda de Ingressos</h1>

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={abrirModalAdicionar}
                    >
                        Adicionar Venda
                    </button>

                    <div className="d-flex">
                        <SearchInput
                            placeholder="Buscar ingressos"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                        {termoBusca && (
                            <button
                                className="btn btn-light ms-2"
                                onClick={() => setTermoBusca('')}
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="text-center align-middle">ID</th>
                                <th className="text-center align-middle">Sessão</th>
                                <th className="text-center align-middle">Nome do Cliente</th>
                                <th className="text-center align-middle">CPF</th>
                                <th className="text-center align-middle">Assento</th>
                                <th className="text-center align-middle">Pagamento</th>
                                <th className="text-center align-middle">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendasFiltradas.map(venda => (
                                <tr key={venda.id}>
                                    <td className="text-center align-middle">{venda.id}</td>
                                    <td className="text-center align-middle">{venda.sessao}</td>
                                    <td className="text-center align-middle">{venda.nomeCliente}</td>
                                    <td className="text-center align-middle">{formatarCPF(venda.cpf)}</td>
                                    <td className="text-center align-middle">{venda.assento}</td>
                                    <td className="text-center align-middle">{venda.tipoPagamento}</td>
                                    <td className="text-center align-middle">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => abrirModalEdicao(venda)}>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => prepararExclusao(venda)}>
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal de Adição/Edição */}
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    titulo={vendaEditando ? 'Editar Venda' : 'Nova Venda'}
                    footerContent={
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Fechar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                form="formVenda"
                            >
                                Salvar
                            </button>
                        </>
                    }
                >
                    <form id="formVenda" onSubmit={handleSubmit}>
                        <SelectInput
                            name="sessao"
                            label="Sessão"
                            options={sessoes.map(s => ({
                                value: s.id,
                                label: `${s.filme} - ${s.sala}`
                            }))}
                            required
                            value={formData.sessao}
                            onChange={handleInputChange}
                            defaultText="Selecione a sessão"
                        />
                        <InputText
                            name="nomeCliente"
                            label="Nome do Cliente"
                            required
                            value={formData.nomeCliente}
                            onChange={handleInputChange}
                            placeholder="Digite o nome do cliente"
                        />
                        <InputText
                            name="cpf"
                            label="CPF do Cliente"
                            required
                            value={formData.cpf}
                            onChange={handleInputChange}
                            placeholder="Digite o CPF do cliente"
                        />
                        <InputText
                            name="assento"
                            label="Assento"
                            required
                            value={formData.assento}
                            onChange={handleInputChange}
                            placeholder="Digite o número do assento"
                        />
                        <SelectInput
                            name="tipoPagamento"
                            label="Tipo de Pagamento"
                            options={tiposPagamento}
                            required
                            value={formData.tipoPagamento}
                            onChange={handleInputChange}
                            defaultText="Selecione o tipo de pagamento"
                        />
                    </form>
                </Modal>

                {/* Modal de Confirmação de Exclusão */}
                <Modal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    titulo="Confirmar Exclusão"
                    footerContent={
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmarExclusao}
                            >
                                Excluir
                            </button>
                        </>
                    }
                >
                    <p>Tem certeza que deseja excluir o ingresso de <strong>{vendaParaExcluir?.nomeCliente}</strong> para a sessão <strong>{vendaParaExcluir?.sessao}</strong>?</p>
                </Modal>
            </div>
        </div>
    );
}

export default IngressoPage;