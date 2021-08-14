import style from "../containers/Panels.module.css";

function Checkbox({ id, isChecked, children, handleChange }) {
  return (
    <div>
      <input
        type="checkbox"
        className={style.inline}
        id={id}
        onChange={handleChange}
        checked={isChecked}
      />
      <label className={style.inline} htmlFor={id}>
        {children}
      </label>
    </div>
  );
}

export default Checkbox;
