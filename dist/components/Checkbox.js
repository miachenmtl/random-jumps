function Checkbox({
  id,
  isChecked,
  isDisabled,
  children,
  handleChange
}) {
  const labelClass = isDisabled ? "disabled" : undefined;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: id,
    onChange: handleChange,
    checked: isChecked,
    disabled: isDisabled
  }), /*#__PURE__*/React.createElement("label", {
    className: labelClass,
    htmlFor: id
  }, children));
}

export default Checkbox;