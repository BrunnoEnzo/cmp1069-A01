import React from 'react';
import Button from '../../../components/Button/Button';

const SessaoViewTable = ({
  sessoes,
  termoBusca,
  buscarSessoes,
  redirecionarParaVenda,
  formatarData
}) => {
  return (
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
              <td colSpan="6" className="text-center">
                {termoBusca ? 'Nenhuma sessão encontrada' : 'Nenhuma sessão disponível'}
              </td>
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
                  <Button
                    cor="success"
                    tamanho="sm"
                    classeAdicional='customMenor-btn'
                    onClick={() => redirecionarParaVenda(sessao.id, sessao.filme, sessao.sala)}
                    ariaLabel={`Comprar ingresso para ${sessao.filme}`}
                  >
                    Comprar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessaoViewTable;