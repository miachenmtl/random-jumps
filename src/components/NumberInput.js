import style from "./components.module.css";
import panelStyle from "../containers/Panels.module.css";

import { MIN_BOARD_LENGTH, MAX_BOARD_LENGTH } from "../constants";

function NumberInput({ label, value, handleChange }) {
  return (
    <div className={style.numberInputWrapper}>
      <label className={panelStyle.inline} htmlFor={`${label}-input`}>
        {label}
      </label>
      <input
        type="number"
        className={style.numberInput}
        id={`${label}-input`}
        value={value}
        min={MIN_BOARD_LENGTH}
        max={MAX_BOARD_LENGTH}
        onChange={handleChange}
      />
    </div>
  );
}

export default NumberInput;
