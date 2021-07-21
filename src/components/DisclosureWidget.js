import { useState, cloneElement } from "react";

function DisclosureWidget({ buttonText, children, ...restProps }) {
  const [expanded, setExpanded] = useState(false);
  let togglerClass = "disclosure-toggler";
  let contentClass = "disclosure-content";
  if (expanded) {
    togglerClass += " open";
    contentClass += " open";
  }
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
