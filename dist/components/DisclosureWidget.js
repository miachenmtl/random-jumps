import { useState, cloneElement } from "react";

function DisclosureWidget({
  buttonText,
  children,
  ...restProps
}) {
  const [expanded, setExpanded] = useState(false);
  let togglerClass = "disclosure-toggler";
  let contentClass = "disclosure-content";

  if (expanded) {
    togglerClass += " open";
    contentClass += " open";
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: togglerClass,
    onClick: () => {
      setExpanded(!expanded);
    }
  }, buttonText), /*#__PURE__*/React.createElement("div", {
    className: contentClass
  }, /*#__PURE__*/cloneElement(children, restProps)));
}

export default DisclosureWidget;