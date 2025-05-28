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
import VendaTable from '../features/ingressos/components/VendaTable';
import VendaForm from '../features/ingressos/components/VendaForm';

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

        if (!formData.cpf.trim() || formData.cpf.length !== 14 ) {
            if (formData.cpf.length === 14) {
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
            <h1 className="text-center mb-4 custom-text-center">Venda de Ingressos</h1>
    
            <div className="d-flex justify-content-between mb-4">
              <Button
                cor="primary"
                onClick={abrirModalAdicionar}
                ariaLabel="Adicionar nova venda"
              >
                Adicionar Venda
              </Button>
    
              <div className="d-flex">
                <SearchInput
                  placeholder="Buscar ingressos"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                {termoBusca && (
                  <Button
                    cor="light"
                    classeAdicional="ms-2"
                    onClick={() => setTermoBusca('')}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
    
            <VendaTable
              vendasFiltradas={vendasFiltradas}
              abrirModalEdicao={abrirModalEdicao}
              prepararExclusao={prepararExclusao}
              formatarCPF={formatarCPF}
            />
    
            {/* Modal de Adição/Edição */}
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              titulo={vendaEditando ? 'Editar Venda' : 'Nova Venda'}
            >
              <VendaForm
                formData={formData}
                sessoes={sessoes}
                tiposPagamento={tiposPagamento}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isEditing={!!vendaEditando}
              />
            </Modal>
    
            {/* Modal de Confirmação de Exclusão */}
            <Modal
              show={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              titulo="Confirmar Exclusão"
              footerContent={
                <>
                  <Button
                    cor="secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    cor="danger"
                    onClick={confirmarExclusao}
                  >
                    Excluir
                  </Button>
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