import React from "react";
function CadastroSalas() {
  return (
    <div className="container">
      <h1 className="text-center">Cadastro de Salas</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="numero" className="form-label">
            Número da Sala
          </label>
          <input type="text" className="form-control" id="numero" />
        </div>
        <div className="mb-3">
          <label htmlFor="capacidade" className="form-label">
            Capacidade
          </label>
          <input type="number" className="form-control" id="capacidade" />
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
export default CadastroSalas;