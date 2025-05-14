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
                <h1 className="text-center mb-4">Cadastro de Sessões</h1>

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={abrirModalAdicionar}
                    >
                        Adicionar Sessão
                    </button>

                    <div className="d-flex">
                        <SearchInput
                            placeholder="Buscar sessões"
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
                                <th className="text-center align-middle">Filme</th>
                                <th className="text-center align-middle">Sala</th>
                                <th className="text-center align-middle">Data</th>
                                <th className="text-center align-middle">Hora</th>
                                <th className="text-center align-middle">Preço</th>
                                <th className="text-center align-middle">Idioma</th>
                                <th className="text-center align-middle">Formato</th>
                                <th className="text-center align-middle">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessoesFiltradas.map(sessao => (
                                <tr key={sessao.id}>
                                    <td className="text-center align-middle">{sessao.id}</td>
                                    <td className="text-center align-middle">{sessao.filme}</td>
                                    <td className="text-center align-middle">{sessao.sala}</td>
                                    <td className="text-center align-middle">{formatarData(sessao.data)}</td>
                                    <td className="text-center align-middle">{sessao.horario}</td>
                                    <td className="text-center align-middle">R$ {sessao.preco.toFixed(2)}</td>
                                    <td className="text-center align-middle">{sessao.idioma}</td>
                                    <td className="text-center align-middle">{sessao.formato}</td>
                                    <td className="text-center align-middle">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => abrirModalEdicao(sessao)}>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => prepararExclusao(sessao)}>
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
                    titulo={sessaoEditando ? 'Editar Sessão' : 'Adicionar Sessão'}
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
                                form="formSessao"
                            >
                                Salvar
                            </button>
                        </>
                    }
                >
                    <form id="formSessao" onSubmit={handleSubmit}>
                        <SelectInput
                            name="filme"
                            label="Filme"
                            options={filmes.map(f => ({ value: f.id, label: f.titulo }))}
                            required
                            value={formData.filme}
                            onChange={handleInputChange}
                            defaultText="Selecione o filme"
                        />
                        <SelectInput
                            name="sala"
                            label="Sala"
                            options={salas.map(s => ({ value: s.id, label: s.nomeSala }))}
                            required
                            value={formData.sala}
                            onChange={handleInputChange}
                            defaultText="Selecione a sala"
                        />
                        <InputDateTime
                            name="dataHora"
                            label="Data e Hora"
                            required
                            value={formData.dataHora}
                            onChange={handleInputChange}
                        />
                        <InputText
                            name="preco"
                            label="Preço"
                            type="number"
                            required
                            value={formData.preco}
                            onChange={handleInputChange}
                            min="0.01"
                            step="0.01"
                        />
                        <SelectInput
                            name="idioma"
                            label="Idioma"
                            options={idiomas}
                            required
                            value={formData.idioma}
                            onChange={handleInputChange}
                            defaultText="Selecione o idioma"
                        />
                        <SelectInput
                            name="formato"
                            label="Formato"
                            options={formatos}
                            required
                            value={formData.formato}
                            onChange={handleInputChange}
                            defaultText="Selecione o formato"
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
                    <p>Tem certeza que deseja excluir a sessão <strong>{sessaoParaExcluir?.filme} - {sessaoParaExcluir?.sala}</strong>?</p>
                    <p className="text-warning">Atenção: Todos os ingressos vendidos para esta sessão serão removidos!</p>
                </Modal>
            </div>
        </div>
    );
}

export default SessaoPage;