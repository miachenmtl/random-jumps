import style from "../containers/Panels.module.css";

function Checkbox({
  id,
  isChecked,
  children,
  handleChange
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    className: style.inline,
    id: id,
    onChange: handleChange,
    checked: isChecked
  }), /*#__PURE__*/React.createElement("label", {
    className: style.inline,
    htmlFor: id
  }, children));
}

export default Checkbox;