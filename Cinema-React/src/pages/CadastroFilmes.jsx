import React from "react";
function CadastroFilmes() {
    return (
        <div className="container">
        <h1 className="text-center">Cadastro de Filmes</h1>
        <form>
            <div className="mb-3">
            <label htmlFor="titulo" className="form-label">
                Título
            </label>
            <input type="text" className="form-control" id="titulo" />
            </div>
            <div className="mb-3">
            <label htmlFor="genero" className="form-label">
                Gênero
            </label>
            <input type="text" className="form-control" id="genero" />
            </div>
            <div className="mb-3">
            <label htmlFor="duracao" className="form-label">
                Duração (minutos)
            </label>
            <input type="number" className="form-control" id="duracao" />
            </div>
            <button type="submit" className="btn btn-primary">
            Cadastrar
            </button>
        </form>
        </div>
    );
    }
export default CadastroFilmes;