import React, { useState, useEffect } from 'react';
import { Sessao } from '../model/sessao';
import Button from '../components/Button/Button';
import SearchInput from '../components/Input/SearchInput';
import Navbar from "../components/navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import SessaoViewTable from '../features/sessoes/components/SessaoViewTable';

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
                <h1 className="text-center mb-4 custom-text-center">Sessões Disponíveis</h1>

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
                        <Button
                            cor="light"
                            onClick={buscarSessoes}
                            ariaLabel="Buscar sessões"
                        >
                            Buscar
                        </Button>
                    </div>
                </div>

                <SessaoViewTable
                    sessoes={sessoes}
                    termoBusca={termoBusca}
                    buscarSessoes={buscarSessoes}
                    redirecionarParaVenda={redirecionarParaVenda}
                    formatarData={formatarData}
                />
            </div>
        </div>
    );
}

export default SessaoViewPage;