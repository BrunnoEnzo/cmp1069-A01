function InputDate({
  id,
  label,
  required = false,
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type="date"
        className="form-control"
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export default InputDate;
