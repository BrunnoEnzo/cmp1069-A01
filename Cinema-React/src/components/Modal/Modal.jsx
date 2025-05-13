import React, { useEffect } from 'react';

function Modal({ id, titulo = 'Título', children, onClose, onSave }) {
  useEffect(() => {
    // Inicializa o modal quando o componente monta
    const modalElement = document.getElementById(id);
    if (!modalElement) return;

    // Adiciona listener para o evento de fechamento
    const handleHidden = () => onClose && onClose();
    modalElement.addEventListener('hidden.bs.modal', handleHidden);

    // Limpeza quando o componente desmontar
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [id, onClose]);

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{titulo}</h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Fechar"
            />
          </div>
          
          <div className="modal-body">
            {children}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Fechar
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;