import style from "./components.module.css";
import panelStyle from "../containers/Panels.module.css";
import { MIN_BOARD_LENGTH, MAX_BOARD_LENGTH } from "../constants";

function NumberInput({
  label,
  value,
  handleChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: style.numberInputWrapper
  }, /*#__PURE__*/React.createElement("label", {
    className: panelStyle.inline,
    htmlFor: `${label}-input`
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: style.numberInput,
    id: `${label}-input`,
    value: value,
    min: MIN_BOARD_LENGTH,
    max: MAX_BOARD_LENGTH,
    onChange: handleChange
  }));
}

export default NumberInput;