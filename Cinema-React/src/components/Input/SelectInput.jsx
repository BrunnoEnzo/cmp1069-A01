function SelectInput({
    id,
    label,
    options = [],
    required = false,
    value = "",
    onChange = () => {},
    className = "",
    disabled = false,
    defaultText = "Selecione uma opção"
  }) {
    return (
      <div className={`mb-3 ${className}`}>
        {label && <label htmlFor={id} className="form-label">{label}</label>}
        <select
          className="form-select"
          id={id}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-label={label}
        >
          <option value="">{defaultText}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export default SelectInput;