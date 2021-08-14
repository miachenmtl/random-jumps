import { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames";
import { EOL } from "os";
import strings from "../strings";
import LangContext from "../LangContext";
import useCopy from "../utils/useCopy";
import panelStyle from "../containers/Panels.module.css";
import style from "./StatsSection.module.css";
const {
  TRIP_COUNT,
  MOVE_COUNTS,
  AVERAGE,
  COPY,
  COPY_MSG,
  COPIED
} = strings;

const sumReducer = (acc, val) => acc + val;

function StatsSection({
  id,
  heading,
  array
}) {
  const {
    lang
  } = useContext(LangContext);
  const [buttonText, setButtonText] = useState(COPY[lang]);
  const handleCopy = useCopy(() => setButtonText(COPIED[lang]), () => setButtonText(COPY[lang]), lang);
  const [showCopy, setShowCopy] = useState(false);
  const textareaRef = useRef(null);

  const handleMouseEnter = () => {
    setShowCopy(true);
  };

  const handleMouseLeave = () => {
    setShowCopy(false);
  };

  useEffect(() => {
    // NB: scroll methods not implemented in jsdom
    // see https://github.com/jsdom/jsdom/pull/2626
    // and https://github.com/jsdom/jsdom/issues/2751
    // FIXME: make this testable
    if (textareaRef?.current?.scrollTo) {
      const {
        scrollHeight
      } = textareaRef.current;
      textareaRef.current.scrollTo({
        top: scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    }
  });
  const textareaId = `textarea-${id}`;
  const countId = `count-${id}`;
  const aveId = `ave-${id}`;
  const textareaValue = array.join(", ");
  const average = array.length > 0 ? (array.reduce(sumReducer) / array.length).toFixed(2) : "";
  let clipboardValue = array.join(EOL);
  clipboardValue += EOL;
  const buttonClass = classNames({
    [style.copy]: true,
    [style.show]: showCopy
  });
  const msgClass = classNames({
    [style.copyMsg]: true,
    [style.show]: showCopy
  });
  return /*#__PURE__*/React.createElement("div", {
    className: panelStyle.section,
    "data-heading": heading
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: panelStyle.inline,
    id: countId
  }, TRIP_COUNT[lang]), /*#__PURE__*/React.createElement("span", {
    "aria-labelledby": countId
  }, array.length.toString())), /*#__PURE__*/React.createElement("label", {
    htmlFor: textareaId,
    className: panelStyle.label
  }, MOVE_COUNTS[lang]), /*#__PURE__*/React.createElement("div", {
    className: style.textareaWrapper,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }, /*#__PURE__*/React.createElement("textarea", {
    id: textareaId,
    ref: textareaRef,
    className: style.statTextarea,
    readOnly: true,
    value: textareaValue
  }), /*#__PURE__*/React.createElement("button", {
    className: buttonClass,
    onClick: () => {
      handleCopy(clipboardValue);
    }
  }, buttonText), /*#__PURE__*/React.createElement("div", {
    className: msgClass
  }, COPY_MSG[lang])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: panelStyle.inline,
    id: aveId
  }, AVERAGE[lang]), /*#__PURE__*/React.createElement("span", {
    "aria-labelledby": aveId
  }, average)));
}

export default StatsSection;