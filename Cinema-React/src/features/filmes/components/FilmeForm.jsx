import React from 'react';
import InputText from '../../../components/Input/InputText';
import SelectInput from '../../../components/Input/SelectInput';

const FilmeForm = ({
  formData,
  generos,
  classificacoes,
  handleInputChange,
  handleSubmit
}) => {
  return (
    <form id="formFilme" onSubmit={handleSubmit}>
      <InputText
        name="titulo"
        label="Título"
        required
        value={formData.titulo}
        onChange={handleInputChange}
      />
      <InputText
        name="descricao"
        label="Descrição"
        required
        value={formData.descricao}
        onChange={handleInputChange}
      />
      <SelectInput
        name="genero"
        label="Gênero"
        options={generos}
        required
        value={formData.genero}
        onChange={handleInputChange}
      />
      <SelectInput
        name="classificacao"
        label="Classificação"
        options={classificacoes}
        required
        value={formData.classificacao}
        onChange={handleInputChange}
      />
      <InputText
        name="duracao"
        label="Duração (minutos)"
        type="number"
        required
        value={formData.duracao}
        onChange={handleInputChange}
      />
      <InputText
        name="dataEstreia"
        label="Data de Estreia"
        type="date"
        required
        value={formData.dataEstreia}
        onChange={handleInputChange}
      />
    </form>
  );
};

export default FilmeForm;