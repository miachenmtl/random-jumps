import { MIN_BOARD_LENGTH, MAX_BOARD_LENGTH } from "../constants";

function NumberInput({
  label,
  value,
  handleChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "number-input-wrapper"
  }, /*#__PURE__*/React.createElement("label", {
    className: "number",
    htmlFor: `${label}-input`
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    id: `${label}-input`,
    value: value,
    min: MIN_BOARD_LENGTH,
    max: MAX_BOARD_LENGTH,
    onChange: handleChange
  }));
}

export default NumberInput;