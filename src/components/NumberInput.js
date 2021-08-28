import { MIN_BOARD_LENGTH, MAX_BOARD_LENGTH } from "../constants";

function NumberInput({ label, value, handleChange, title }) {
  const titleValue = title.length > 0 ? title : undefined;
  return (
    <div className="number-input-wrapper" title={titleValue}>
      <label className="number" htmlFor={`${label}-input`}>
        {label}
      </label>
      <input
        type="number"
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
