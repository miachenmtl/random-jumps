import { useRef, useEffect } from "react";

const sumReducer = (acc, val) => acc + val;

function StatsSection({ id, heading, array }) {
  const textareaRef = useRef(null);

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

  return (
    <div className="section" data-heading={heading}>
      <div>
        <label className="inline" id={countId}>
          Completed trips:
        </label>
        <span aria-labelledby={countId}>{array.length.toString()}</span>
      </div>
      <label htmlFor={textareaId}>Moves per trip:</label>
      <textarea
        id={textareaId}
        ref={textareaRef}
        readOnly
        value={textareaValue}
      />
      <div>
        <label className="inline" id={aveId}>
          Average:
        </label>
        <span aria-labelledby={aveId}>{average}</span>
      </div>
    </div>
  );
}

export default StatsSection;
