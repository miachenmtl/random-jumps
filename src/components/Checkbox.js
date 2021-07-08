function Checkbox({ id, isChecked, isDisabled, children, handleChange }) {
  const labelClass = isDisabled ? "disabled" : undefined;
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        onChange={handleChange}
        checked={isChecked}
        disabled={isDisabled}
      />
      <label className={labelClass} htmlFor={id}>
        {children}
      </label>
    </div>
  );
}

export default Checkbox;
