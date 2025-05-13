function InputDateTime({
  id,
  label,
  required = false,
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
  min = "",
  max = "",
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        className="form-control"
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
}

export default InputDateTime;
