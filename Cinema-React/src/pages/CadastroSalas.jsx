import React, { useState, useEffect } from 'react';
import { Sala } from '../model/sala';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import InputText from '../components/Input/InputText';
import SelectInput from '../components/Input/SelectInput';
import SearchInput from '../components/Input/SearchInput';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

function SalaPage() {
    const [salas, setSalas] = useState(() => {
        const salasSalvas = localStorage.getItem('salas');
        return salasSalvas ? JSON.parse(salasSalvas) : [];
    });
    const [salaEditando, setSalaEditando] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [salaParaExcluir, setSalaParaExcluir] = useState(null);
    const [formData, setFormData] = useState({
        nomeSala: '',
        capacidade: '',
        tipo: ''
    });

    const tiposSala = [
        { value: '1', label: '2D' },
        { value: '2', label: '3D' },
        { value: '3', label: 'IMAX' }
    ];

    // Salva no localStorage quando salas mudam
    useEffect(() => {
        const salvarSalas = () => {
            try {
                localStorage.setItem('salas', JSON.stringify(salas));
            } catch (error) {
                console.error('Erro ao salvar salas no localStorage:', error);
            }
        };
        salvarSalas();
    }, [salas]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação
        if (!formData.nomeSala.trim()) {
            alert('Por favor, informe o nome/número da sala');
            return;
        }
        
        if (!formData.capacidade || isNaN(formData.capacidade)) {
            alert('Por favor, informe uma capacidade válida');
            return;
        }
        
        if (!formData.tipo) {
            alert('Por favor, selecione o tipo de sala');
            return;
        }

        const novoSala = new Sala(
            salaEditando?.id || Date.now(),
            formData.nomeSala,
            parseInt(formData.capacidade),
            tiposSala.find(t => t.value === formData.tipo)?.label
        );

        if (salaEditando) {
            setSalas(salas.map(s => s.id === salaEditando.id ? novoSala : s));
        } else {
            setSalas([...salas, novoSala]);
        }

        setShowModal(false);
        setSalaEditando(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            nomeSala: '',
            capacidade: '',
            tipo: ''
        });
    };

    const prepararExclusao = (sala) => {
        setSalaParaExcluir(sala);
        setShowDeleteModal(true);
    };

    const confirmarExclusao = () => {
        setSalas(salas.filter(s => s.id !== salaParaExcluir.id));
        setShowDeleteModal(false);
        setSalaParaExcluir(null);
    };

    const abrirModalEdicao = (sala) => {
        setSalaEditando(sala);
        setFormData({
            nomeSala: sala.nomeSala,
            capacidade: sala.capacidade.toString(),
            tipo: tiposSala.find(t => t.label === sala.tipo)?.value || ''
        });
        setShowModal(true);
    };

    const abrirModalAdicionar = () => {
        setSalaEditando(null);
        resetForm();
        setShowModal(true);
    };

    const salasFiltradas = termoBusca
        ? salas.filter(s =>
            s.nomeSala.toLowerCase().includes(termoBusca.toLowerCase()))
        : salas;

    return (
        <div className="bg-dark text-light table-responsive" style={{ minHeight: "100vh", width: '100vw', boxSizing: "border-box" }}>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Cadastro de Salas</h1>

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={abrirModalAdicionar}
                    >
                        Adicionar Sala
                    </button>

                    <div className="d-flex">
                        <SearchInput
                            placeholder="Buscar salas"
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
                                <th className="text-center align-middle">Sala</th>
                                <th className="text-center align-middle">Capacidade</th>
                                <th className="text-center align-middle">Tipo</th>
                                <th className="text-center align-middle">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salasFiltradas.map(sala => (
                                <tr key={sala.id}>
                                    <td className="text-center align-middle">{sala.id}</td>
                                    <td className="text-center align-middle">{sala.nomeSala}</td>
                                    <td className="text-center align-middle">{sala.capacidade}</td>
                                    <td className="text-center align-middle">{sala.tipo}</td>
                                    <td className="text-center align-middle">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => abrirModalEdicao(sala)}>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => prepararExclusao(sala)}>
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
                    titulo={salaEditando ? 'Editar Sala' : 'Adicionar Sala'}
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
                                form="formSala"
                            >
                                Salvar
                            </button>
                        </>
                    }
                >
                    <form id="formSala" onSubmit={handleSubmit}>
                        <InputText
                            name="nomeSala"
                            label="Nome/Número da Sala"
                            required
                            value={formData.nomeSala}
                            onChange={handleInputChange}
                        />
                        <InputText
                            name="capacidade"
                            label="Capacidade"
                            type="number"
                            required
                            value={formData.capacidade}
                            onChange={handleInputChange}
                            min="1"
                        />
                        <SelectInput
                            name="tipo"
                            label="Tipo de Sala"
                            options={tiposSala}
                            required
                            value={formData.tipo}
                            onChange={handleInputChange}
                            defaultText="Selecione o tipo de sala"
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
                    <p>Tem certeza que deseja excluir a sala <strong>{salaParaExcluir?.nomeSala}</strong>?</p>
                    <p className="text-warning">Atenção: Todas as sessões relacionadas a esta sala também serão removidas!</p>
                </Modal>
            </div>
        </div>
    );
}

export default SalaPage;