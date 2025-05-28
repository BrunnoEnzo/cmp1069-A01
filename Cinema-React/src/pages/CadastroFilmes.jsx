import React, { useState, useEffect } from 'react';
import { Filme } from '../model/filme';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import InputText from '../components/Input/InputText';
import SelectInput from '../components/Input/SelectInput';
import SearchInput from '../components/Input/SearchInput';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"


function FilmePage() {
    const [filmes, setFilmes] = useState(() => {
        const filmesSalvos = localStorage.getItem('filmes');
        return filmesSalvos ? JSON.parse(filmesSalvos) : [];
    });
    const [filmeEditando, setFilmeEditando] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filmeParaExcluir, setFilmeParaExcluir] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        genero: '',
        classificacao: '',
        duracao: '',
        dataEstreia: ''
    });

    const generos = [
        { value: '1', label: 'Ação' },
        { value: '2', label: 'Suspense' },
        { value: '3', label: 'Comédia' },
        { value: '4', label: 'Drama' },
        { value: '5', label: 'Terror' },
        { value: '6', label: 'Romance' },
        { value: '7', label: 'Ficção Científica' },
        { value: '8', label: 'Documentário' },
        { value: '9', label: 'Animação' },
        { value: '10', label: 'Fantasia' },
        { value: '11', label: 'Aventura' },
        { value: '12', label: 'Musical' }
    ];

    const classificacoes = [
        { value: '13', label: 'Livre' },
        { value: '14', label: '+10' },
        { value: '15', label: '+12' },
        { value: '16', label: '+14' },
        { value: '17', label: '+16' },
        { value: '18', label: '+18' }
    ];

    // Salva no localStorage quando filmes mudam
    useEffect(() => {
        const salvarFilmes = () => {
            try {
                console.log('Salvando filmes no localStorage:', filmes);
                localStorage.setItem('filmes', JSON.stringify(filmes));
            } catch (error) {
                console.error('Erro ao salvar filmes no localStorage:', error);
            }
        };
        salvarFilmes();
    }, [filmes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const novoFilme = new Filme(
            filmeEditando?.id || Date.now(),
            formData.titulo,
            formData.descricao,
            generos.find(g => g.value === formData.genero)?.label,
            classificacoes.find(c => c.value === formData.classificacao)?.label,
            formData.duracao,
            formData.dataEstreia
        );

        if (filmeEditando) {
            setFilmes(filmes.map(f => f.id === filmeEditando.id ? novoFilme : f));
        } else {
            setFilmes([...filmes, novoFilme]);
        }

        setShowModal(false);
        setFilmeEditando(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descricao: '',
            genero: '',
            classificacao: '',
            duracao: '',
            dataEstreia: ''
        });
    };

    const prepararExclusao = (filme) => {
        setFilmeParaExcluir(filme);
        setShowDeleteModal(true);
    };

    const confirmarExclusao = () => {
        setFilmes(filmes.filter(f => f.id !== filmeParaExcluir.id));
        setShowDeleteModal(false);
        setFilmeParaExcluir(null);
    };

    const abrirModalEdicao = (filme) => {
        setFilmeEditando(filme);
        setFormData({
            titulo: filme.titulo,
            descricao: filme.descricao,
            genero: generos.find(g => g.label === filme.genero)?.value || '',
            classificacao: classificacoes.find(c => c.label === filme.classificacao)?.value || '',
            duracao: filme.duracao,
            dataEstreia: filme.dataEstreia.split('T')[0]
        });
        setShowModal(true);
    };

    const abrirModalAdicionar = () => {
        setFilmeEditando(null);
        resetForm();
        setShowModal(true);
    };

    const filmesFiltrados = termoBusca
        ? filmes.filter(f =>
            f.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
            f.descricao.toLowerCase().includes(termoBusca.toLowerCase()))
        : filmes;

    return (
        <div className="bg-dark text-light table-responsive" style={{ minHeight: "100vh", width: '100vw', boxSizing: "border-box" }}>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Cadastro de Filmes</h1>

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={abrirModalAdicionar}
                    >
                        Adicionar Filme
                    </button>

                    <div className="d-flex">
                        <SearchInput
                            placeholder="Buscar filmes"
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

                <div className="table-responsive"> {/* Mantém o scroll horizontal em mobile */}
                    <table className="table table-dark table-hover align-middle mb-0"> {/* Remove bordas extras */}
                        <thead>
                            <tr>
                                <th className="text-center align-middle">ID</th>
                                <th className="text-center align-middle">Título</th>
                                <th className="text-center align-middle">Descrição</th>
                                <th className="text-center align-middle">Gênero</th>
                                <th className="text-center align-middle">Classificação</th>
                                <th className="text-center align-middle">Duração</th>
                                <th className="text-center align-middle">Data Estreia</th>
                                <th className="text-center align-middle">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filmesFiltrados.map(filme => (
                                <tr key={filme.id}>
                                    <td className="text-center align-middle">{filme.id}</td>
                                    <td className="text-center align-middle">{filme.titulo}</td>
                                    <td className="text-center align-middle">{filme.descricao}</td>
                                    <td className="text-center align-middle">{filme.genero}</td>
                                    <td className="text-center align-middle">{filme.classificacao}</td>
                                    <td className="text-center align-middle">{filme.duracao} min</td>
                                    <td className="text-center align-middle">
                                        {new Date(filme.dataEstreia).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="text-center align-middle">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => abrirModalEdicao(filme)}>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => prepararExclusao(filme)}>
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
                    titulo={filmeEditando ? 'Editar Filme' : 'Adicionar Filme'}
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
                                form="formFilme"
                            >
                                Salvar
                            </button>
                        </>
                    }
                >
                    <form id="formFilme" onSubmit={handleSubmit}>
                        <InputText
                            name="titulo"
                            label="Título"
                            required
                            value={formData.titulo}
                            onChange={handleInputChange}
                        />
                        <InputText
                            name="descricao"
                            label="Descrição"
                            required
                            value={formData.descricao}
                            onChange={handleInputChange}
                        />
                        <SelectInput
                            name="genero"
                            label="Gênero"
                            options={generos}
                            required
                            value={formData.genero}
                            onChange={handleInputChange}
                        />
                        <SelectInput
                            name="classificacao"
                            label="Classificação"
                            options={classificacoes}
                            required
                            value={formData.classificacao}
                            onChange={handleInputChange}
                        />
                        <InputText
                            name="duracao"
                            label="Duração (minutos)"
                            type="number"
                            required
                            value={formData.duracao}
                            onChange={handleInputChange}
                        />
                        <InputText
                            name="dataEstreia"
                            label="Data de Estreia"
                            type="date"
                            required
                            value={formData.dataEstreia}
                            onChange={handleInputChange}
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
                    <p>Tem certeza que deseja excluir o filme <strong>{filmeParaExcluir?.titulo}</strong>?</p>
                </Modal>
            </div>
        </div>
    );
}

export default FilmePage;