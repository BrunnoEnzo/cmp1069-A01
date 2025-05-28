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
import SalaForm from '../features/salas/components/SalaForm';
import SalaTable from '../features/salas/components/SalaTable';

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
        <h1 className="text-center mb-4 custom-text-center">Cadastro de Salas</h1>

        <div className="d-flex justify-content-between mb-4">
            <Button
            cor="primary"
            onClick={abrirModalAdicionar}
            ariaLabel="Adicionar nova sala"
            >
            Adicionar Sala
            </Button>

            <div className="d-flex">
            <SearchInput
                placeholder="Buscar salas"
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

        <SalaTable
            salasFiltradas={salasFiltradas}
            abrirModalEdicao={abrirModalEdicao}
            prepararExclusao={prepararExclusao}
        />

        {/* Modal de Adição/Edição */}
        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            titulo={salaEditando ? 'Editar Sala' : 'Adicionar Sala'}
        >
            <SalaForm
            formData={formData}
            tiposSala={tiposSala}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isEditing={!!salaEditando}
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
            <p>Tem certeza que deseja excluir a sala <strong>{salaParaExcluir?.nomeSala}</strong>?</p>
            <p className="text-warning">Atenção: Todas as sessões relacionadas a esta sala também serão removidas!</p>
        </Modal>
        </div>
    </div>
    );
}
    
export default SalaPage;