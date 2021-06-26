function Checkbox({ id, children, handleChange }) {
  return (
    <div>
      <input type="checkbox" id={id} onChange={handleChange} />
      <label htmlFor={id}>{children}</label> 
    </div>    
  );
}

export default Checkbox;