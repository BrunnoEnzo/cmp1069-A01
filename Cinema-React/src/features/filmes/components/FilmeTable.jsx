import React from 'react';
import Button from '../../../components/Button/Button';

const FilmeTable = ({
  filmesFiltrados,
  abrirModalEdicao,
  prepararExclusao
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover align-middle mb-0">
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
                  <Button
                    cor="warning"
                    tamanho="sm"
                    classeAdicional='customMenor-btn '
                    onClick={() => abrirModalEdicao(filme)}
                    ariaLabel={`Editar filme ${filme.titulo}`}
                  >
                    Editar
                  </Button>
                  <Button
                    cor="danger"
                    tamanho="sm"
                    classeAdicional='customMenor-btn '
                    onClick={() => prepararExclusao(filme)}
                    ariaLabel={`Excluir filme ${filme.titulo}`}
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilmeTable;