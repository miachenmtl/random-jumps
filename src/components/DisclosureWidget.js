import { useState, cloneElement } from "react";
import classNames from "classnames";

import style from "./DisclosureWidget.module.css";

function DisclosureWidget({ buttonText, children, ...restProps }) {
  const [expanded, setExpanded] = useState(false);
  const togglerClass = classNames({
    [style.disclosureToggler]: true,
    [style.open]: expanded,
  });
  const contentClass = classNames({
    [style.disclosureContent]: true,
    [style.open]: expanded,
  });
  return (
    <div>
      <button
        className={togglerClass}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {buttonText}
      </button>
      <div className={contentClass}>{cloneElement(children, restProps)}</div>
    </div>
  );
}

export default DisclosureWidget;
