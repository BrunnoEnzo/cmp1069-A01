import React, { useState, useEffect } from 'react';
import { Sessao } from '../model/sessao';
import Button from '../components/Button/Button';
import SearchInput from '../components/Input/SearchInput';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

function SessaoViewPage() {
    const [sessoes, setSessoes] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');

    // Carrega dados iniciais
    useEffect(() => {
        const carregarSessoes = () => {
            try {
                const sessoesSalvas = localStorage.getItem('sessoes');
                if (sessoesSalvas) {
                    setSessoes(JSON.parse(sessoesSalvas));
                }
            } catch (error) {
                console.error('Erro ao carregar sessões:', error);
            }
        };
        carregarSessoes();
    }, []);

    const buscarSessoes = () => {
        if (!termoBusca.trim()) {
            // Se a busca estiver vazia, mostra todas as sessões
            const sessoesSalvas = localStorage.getItem('sessoes');
            if (sessoesSalvas) {
                setSessoes(JSON.parse(sessoesSalvas));
            }
            return;
        }

        const termo = termoBusca.toLowerCase().trim();
        const sessoesFiltradas = sessoes.filter(s => 
            s.filme.toLowerCase().includes(termo) || 
            s.sala.toLowerCase().includes(termo)
        );
        
        setSessoes(sessoesFiltradas);
    };

    const redirecionarParaVenda = (sessaoId, filme, sala) => {
        // Armazena os dados da sessão selecionada
        sessionStorage.setItem('sessaoSelecionada', JSON.stringify({
            id: sessaoId,
            filme: filme,
            sala: sala
        }));
        
        // Redireciona para a página de vendas
        window.location.href = '/venda-ingressos'; // Ajuste conforme sua rota
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'N/A';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="bg-dark text-light table-responsive" style={{ minHeight: "100vh", width: '100vw', boxSizing: "border-box" }}>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Sessões Disponíveis</h1>

                <div className="d-flex justify-content-between mb-4">
                    <div className="d-flex w-100">
                        <div className="flex-grow-1 me-2">
                            <SearchInput
                                placeholder="Buscar por filme ou sala"
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && buscarSessoes()}
                            />
                        </div>
                        <button
                            className="btn btn-light"
                            onClick={buscarSessoes}
                        >
                            Buscar
                        </button>
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
                                <th className="text-center align-middle">Horário</th>
                                <th className="text-center align-middle">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessoes.length === 0 ? (
                                <tr className="table-dark">
                                    <td colSpan="6" className="text-center">Nenhuma sessão encontrada</td>
                                </tr>
                            ) : (
                                sessoes.map(sessao => (
                                    <tr key={sessao.id} className="table-dark">
                                        <td className="text-center align-middle">{sessao.id}</td>
                                        <td className="text-center align-middle"><strong>{sessao.filme}</strong></td>
                                        <td className="text-center align-middle">{sessao.sala}</td>
                                        <td className="text-center align-middle">{formatarData(sessao.data)}</td>
                                        <td className="text-center align-middle">{sessao.horario}</td>
                                        <td className="text-center align-middle">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => redirecionarParaVenda(sessao.id, sessao.filme, sessao.sala)}
                                            >
                                                Comprar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SessaoViewPage;