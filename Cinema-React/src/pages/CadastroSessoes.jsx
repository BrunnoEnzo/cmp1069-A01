import React, { useState, useEffect } from 'react';
import { Sessao } from '../model/sessao';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import InputText from '../components/Input/InputText';
import SelectInput from '../components/Input/SelectInput';
import SearchInput from '../components/Input/SearchInput';
import InputDateTime from '../components/Input/InputDateTime';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import SessaoForm from '../features/sessoes/components/SessaoForm';
import SessaoTable from '../features/sessoes/components/SessaoTable';

function SessaoPage() {
    const [sessoes, setSessoes] = useState(() => {
        const sessoesSalvas = localStorage.getItem('sessoes');
        return sessoesSalvas ? JSON.parse(sessoesSalvas) : [];
    });
    const [filmes, setFilmes] = useState([]);
    const [salas, setSalas] = useState([]);
    const [sessaoEditando, setSessaoEditando] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sessaoParaExcluir, setSessaoParaExcluir] = useState(null);
    const [formData, setFormData] = useState({
        filme: '',
        sala: '',
        dataHora: '',
        preco: '',
        idioma: '',
        formato: ''
    });

    const idiomas = [
        { value: '1', label: 'Dublado' },
        { value: '2', label: 'Legendado' }
    ];

    const formatos = [
        { value: '3', label: '2D' },
        { value: '4', label: '3D' }
    ];

    // Carrega dados iniciais
    useEffect(() => {
        const carregarDados = () => {
            try {
                const filmesSalvos = localStorage.getItem('filmes');
                const salasSalvas = localStorage.getItem('salas');
                
                if (filmesSalvos) setFilmes(JSON.parse(filmesSalvos));
                if (salasSalvas) setSalas(JSON.parse(salasSalvas));
            } catch (error) {
                console.error('Erro ao carregar filmes e salas:', error);
            }
        };
        carregarDados();
    }, []);

    // Salva no localStorage quando sessoes mudam
    useEffect(() => {
        const salvarSessoes = () => {
            try {
                localStorage.setItem('sessoes', JSON.stringify(sessoes));
            } catch (error) {
                console.error('Erro ao salvar sessões no localStorage:', error);
            }
        };
        salvarSessoes();
    }, [sessoes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const [data, hora] = formData.dataHora.split('T');
        const filmeSelecionado = filmes.find(f => f.id == formData.filme);
        const salaSelecionada = salas.find(s => s.id == formData.sala);
        const idioma = idiomas.find(i => i.value === formData.idioma)?.label;
        const formato = formatos.find(f => f.value === formData.formato)?.label;

        const novaSessao = new Sessao(
            sessaoEditando?.id || Date.now(),
            filmeSelecionado.titulo,
            salaSelecionada.nomeSala,
            data,
            hora,
            parseFloat(formData.preco),
            idioma,
            formato
        );

        if (sessaoEditando) {
            setSessoes(sessoes.map(s => s.id === sessaoEditando.id ? novaSessao : s));
        } else {
            setSessoes([...sessoes, novaSessao]);
        }

        setShowModal(false);
        setSessaoEditando(null);
        resetForm();
    };

    const validarFormulario = () => {
        if (!formData.filme) {
            alert('Por favor, selecione um filme');
            return false;
        }
        if (!formData.sala) {
            alert('Por favor, selecione uma sala');
            return false;
        }
        if (!formData.dataHora) {
            alert('Por favor, informe a data e hora');
            return false;
        }
        if (!formData.preco || isNaN(formData.preco) || formData.preco <= 0) {
            alert('Por favor, informe um preço válido maior que zero');
            return false;
        }
        if (!formData.idioma) {
            alert('Por favor, selecione o idioma');
            return false;
        }
        if (!formData.formato) {
            alert('Por favor, selecione o formato');
            return false;
        }

        const dataSelecionada = new Date(formData.dataHora);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataSelecionada < hoje) {
            alert('A data não pode ser anterior a hoje!');
            return false;
        }

        const cemAnosNoFuturo = new Date();
        cemAnosNoFuturo.setFullYear(hoje.getFullYear() + 100);

        if (dataSelecionada > cemAnosNoFuturo) {
            alert('A data não pode ser superior a 100 anos no futuro!');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            filme: '',
            sala: '',
            dataHora: '',
            preco: '',
            idioma: '',
            formato: ''
        });
    };

    const prepararExclusao = (sessao) => {
        setSessaoParaExcluir(sessao);
        setShowDeleteModal(true);
    };

    const confirmarExclusao = () => {
        setSessoes(sessoes.filter(s => s.id !== sessaoParaExcluir.id));
        setShowDeleteModal(false);
        setSessaoParaExcluir(null);
    };

    const abrirModalEdicao = (sessao) => {
        setSessaoEditando(sessao);
        setFormData({
            filme: filmes.find(f => f.titulo === sessao.filme)?.id || '',
            sala: salas.find(s => s.nomeSala === sessao.sala)?.id || '',
            dataHora: `${sessao.data}T${sessao.horario}`,
            preco: sessao.preco.toString(),
            idioma: idiomas.find(i => i.label === sessao.idioma)?.value || '',
            formato: formatos.find(f => f.label === sessao.formato)?.value || ''
        });
        setShowModal(true);
    };

    const abrirModalAdicionar = () => {
        setSessaoEditando(null);
        resetForm();
        setShowModal(true);
    };

    const sessoesFiltradas = termoBusca
        ? sessoes.filter(s =>
            s.filme.toLowerCase().includes(termoBusca.toLowerCase()) ||
            s.sala.toLowerCase().includes(termoBusca.toLowerCase()))
        : sessoes;

    const formatarData = (data) => {
        if (!data) return 'N/A';
        try {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch {
            return data;
        }
    };

    return (
        <div className="bg-dark text-light table-responsive" style={{ minHeight: "100vh", width: '100vw', boxSizing: "border-box" }}>
        <Navbar />
        <div className="container mt-4">
        <h1 className="text-center mb-4 custom-text-center">Cadastro de Sessões</h1>

        <div className="d-flex justify-content-between mb-4">
            <Button
            cor="primary"
            onClick={abrirModalAdicionar}
            ariaLabel="Adicionar nova sessão"
            >
            Adicionar Sessão
            </Button>

            <div className="d-flex">
            <SearchInput
                placeholder="Buscar sessões"
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

        <SessaoTable
            sessoesFiltradas={sessoesFiltradas}
            abrirModalEdicao={abrirModalEdicao}
            prepararExclusao={prepararExclusao}
            formatarData={formatarData}
        />

        {/* Modal de Adição/Edição */}
        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            titulo={sessaoEditando ? 'Editar Sessão' : 'Adicionar Sessão'}
        >
            <SessaoForm
            formData={formData}
            filmes={filmes}
            salas={salas}
            idiomas={idiomas}
            formatos={formatos}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isEditing={!!sessaoEditando}
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
            <p>Tem certeza que deseja excluir a sessão <strong>{sessaoParaExcluir?.filme} - {sessaoParaExcluir?.sala}</strong>?</p>
            <p className="text-warning">Atenção: Todos os ingressos vendidos para esta sessão serão removidos!</p>
        </Modal>
        </div>
    </div>
    );
}
    
export default SessaoPage;