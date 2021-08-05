import { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames";
import { EOL } from "os";

import strings from "../strings";
import LangContext from "../LangContext";
import useCopy from "../utils/useCopy";

const { TRIP_COUNT, MOVE_COUNTS, AVERAGE, COPY, COPY_MSG, COPIED } = strings;

const sumReducer = (acc, val) => acc + val;

function StatsSection({ id, heading, array }) {
  const { lang } = useContext(LangContext);
  const [buttonText, setButtonText] = useState(COPY[lang]);

  const handleCopy = useCopy(
    () => setButtonText(COPIED[lang]),
    () => setButtonText(COPY[lang]),
    lang
  );

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
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.scrollTo({
        top: scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });
  const textareaId = `textarea-${id}`;
  const countId = `count-${id}`;
  const aveId = `ave-${id}`;

  const textareaValue = array.join(", ");
  const average =
    array.length > 0
      ? (array.reduce(sumReducer) / array.length).toFixed(2)
      : "";
  let clipboardValue = array.join(EOL);
  clipboardValue += EOL;

  const buttonClass = classNames({ copy: true, show: showCopy });
  const msgClass = classNames({ "copy-msg": true, show: showCopy });

  return (
    <div className="section" data-heading={heading}>
      <div>
        <label className="inline" id={countId}>
          {TRIP_COUNT[lang]}
        </label>
        <span aria-labelledby={countId}>{array.length.toString()}</span>
      </div>
      <label htmlFor={textareaId}>{MOVE_COUNTS[lang]}</label>
      <div
        className="textarea-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          id={textareaId}
          ref={textareaRef}
          readOnly
          value={textareaValue}
        />
        <button
          className={buttonClass}
          onClick={() => {
            handleCopy(clipboardValue);
          }}
        >
          {buttonText}
        </button>
        <div className={msgClass}>{COPY_MSG[lang]}</div>
      </div>

      <div>
        <label className="inline" id={aveId}>
          {AVERAGE[lang]}
        </label>
        <span aria-labelledby={aveId}>{average}</span>
      </div>
    </div>
  );
}

export default StatsSection;
