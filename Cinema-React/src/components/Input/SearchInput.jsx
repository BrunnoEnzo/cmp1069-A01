function SearchInput({
    id,
    placeholder = "",
    value = "",
    onChange = () => {},
    className = "",
    disabled = false
  }) {
    return (
      <input
        type="text"
        className={`form-control ${className}`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label="Pesquisar"
      />
    );
  }
  
  export default SearchInput;