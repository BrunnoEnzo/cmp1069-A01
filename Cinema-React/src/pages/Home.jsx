import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import Card from "../components/Card/Card";

function Home() {
  const [totalFilmes, setTotalFilmes] = useState(0);
  const [proximasSessoes, setProximasSessoes] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    carregarTotalFilmes();
    carregarProximasSessoes();
    carregarVendasHoje();
  };

  const carregarTotalFilmes = () => {
    try {
      const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
      setTotalFilmes(filmes.length);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    }
  };

  const carregarProximasSessoes = () => {
    try {
      const sessoes = JSON.parse(localStorage.getItem("sessoes") || "[]");
      const hoje = new Date().toISOString().split("T")[0];

      const proximas = sessoes.filter((s) => s.data >= hoje).slice(0, 3); // Limita a 3 resultados

      setProximasSessoes(proximas);
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    }
  };

  const carregarVendasHoje = () => {
    try {
      const vendas = JSON.parse(localStorage.getItem("vendas") || "[]");
      const hoje = new Date().toLocaleDateString("pt-BR");

      const vendasHoje = vendas.filter((v) => {
        const dataVenda = new Date(v.id).toLocaleDateString("pt-BR");
        return dataVenda === hoje;
      });

      setTotalVendas(vendasHoje.length);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  };

  return (
    <div className="bg-dark text-light" style={{ minHeight: "100vh" ,width: '100vw', boxSizing: "border-box"}}>
      <Navbar />

      <div className="container-fluid py-4">
        {" "}
        {/* container-fluid para usar toda a largura */}
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-4">
            <h1>Bem-vindo ao Sistema de Gerenciamento de Cinema</h1>
            <p className="lead">
              Gerencie filmes, salas, sessões e vendas de ingressos
            </p>
          </div>
        </div>
        <div className="row justify-content-center px-3">
          {" "}
          {/* Adicionado px-3 para padding lateral */}
          <div className="col-md-4 col-lg-3 mb-4">
            <Card
              title="Filmes Cadastrados"
              value={totalFilmes}
              linkText="Gerenciar Filmes"
              linkTo="/cadastro-filmes"
              bgColor="secondary"
            />
          </div>
          <div className="col-md-4 col-lg-3 mb-4">
            <Card
              title="Próximas Sessões"
              linkText="Ver Todas"
              linkTo="/cadastro-sessoes"
              bgColor="primary"
            >
              {/* Seu conteúdo de sessões aqui */}
            </Card>
          </div>
          <div className="col-md-4 col-lg-3 mb-4">
            <Card
              title="Vendas Hoje"
              value={totalVendas}
              linkText="Nova Venda"
              linkTo="/venda-ingressos"
              bgColor="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
