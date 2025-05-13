import { useEffect } from "react";

function InputCpf({
  id,
  label,
  placeholder = "",
  required = false,
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
}) {
  const formatCpf = (rawValue) => {
    // Remove tudo exceto dígitos
    const cleaned = rawValue.replace(/\D/g, "");

    // Aplica máscara: 000.000.000-00
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (!match) return "";

    return [match[1], match[2], match[3], match[4]]
      .filter(Boolean)
      .join(".")
      .replace(/\.(?=\d{2}$)/, "-");
  };

  const handleChange = (e) => {
    const formatted = formatCpf(e.target.value);
    onChange({
      ...e,
      target: { ...e.target, value: formatted },
    });
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type="text"
        className="form-control"
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={14}
        inputMode="numeric"
      />
    </div>
  );
}

export default InputCpf;
