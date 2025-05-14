import { useState, useEffect } from 'react';

function InputCpf({
  id,
  name = id,
  label,
  placeholder = "000.000.000-00",
  required = false,
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
  ...props
}) {
  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const [displayValue, setDisplayValue] = useState(formatCpf(value));

  useEffect(() => {
    setDisplayValue(formatCpf(value));
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCpf(e.target.value);
    
    setDisplayValue(formattedValue);
    
    // Envia o valor sem formatação (apenas números)
    onChange({
      ...e,
      target: {
        ...e.target,
        value: rawValue // Envia apenas os números
      }
    });
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        type="text"
        className="form-control"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        maxLength={14}
        inputMode="numeric"
        {...props}
      />
    </div>
  );
}

export default InputCpf;