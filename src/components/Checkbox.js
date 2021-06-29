function Checkbox({ id, isChecked, isDisabled, children, handleChange }) {
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        onChange={handleChange}
        checked={isChecked}
        disabled={isDisabled}
      />
      <label htmlFor={id}>{children}</label> 
    </div>    
  );
}

export default Checkbox;