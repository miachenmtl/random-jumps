import { useState, cloneElement } from "react";
import classNames from "classnames";
import style from "./DisclosureWidget.module.css";

function DisclosureWidget({
  buttonText,
  children,
  ...restProps
}) {
  const [expanded, setExpanded] = useState(false);
  const togglerClass = classNames({
    [style.disclosureToggler]: true,
    [style.open]: expanded
  });
  const contentClass = classNames({
    [style.disclosureContent]: true,
    [style.open]: expanded
  });
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