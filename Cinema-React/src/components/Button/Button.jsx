function Button({
    children = "Botão",
    tipo = "button",
    cor = "secondary",
    tamanho = "",
    classeAdicional = "",
    disabled = false,
    onClick = () => {},
    icone = null,
    ariaLabel = ""
  }) {
    return (
      <button
        type={tipo}
        className={`btn btn-${cor} ${tamanho} ${classeAdicional}`}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      >
        {icone && <span className="me-2">{icone}</span>}
        {children}
      </button>
    );
  }
  
  export default Button;