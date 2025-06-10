import React, { useState, useEffect } from 'react';
import { Filme } from '../model/filme';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import SearchInput from '../components/Input/SearchInput';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import FilmeForm from '../features/filmes/components/FilmeForm';
import FilmeTable from '../features/filmes/components/FilmeTable';


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
            <h1 className="text-center mb-4 custom-text-center">Cadastro de Filmes</h1>
        
            <div className="d-flex justify-content-between mb-4">
                <Button
                cor="primary"
                onClick={abrirModalAdicionar}
                >
                Adicionar Filme
                </Button>
        
                <div className="d-flex">
                <SearchInput
                    placeholder="Buscar filmes"
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
        
            <FilmeTable
                filmesFiltrados={filmesFiltrados}
                abrirModalEdicao={abrirModalEdicao}
                prepararExclusao={prepararExclusao}
            />
        
            {/* Modal de Adição/Edição */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                titulo={filmeEditando ? 'Editar Filme' : 'Adicionar Filme'}
            >
                <FilmeForm
                formData={formData}
                generos={generos}
                classificacoes={classificacoes}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
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
                <p>Tem certeza que deseja excluir o filme <strong>{filmeParaExcluir?.titulo}</strong>?</p>
            </Modal>
            </div>
        </div>
    );
}

export default FilmePage;