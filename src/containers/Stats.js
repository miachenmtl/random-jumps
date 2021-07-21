import { useState, useEffect, useRef } from 'react';
import { EOL } from 'os';

import StatsSection from '../components/StatsSection';

const BUTTON_TEXT = 'Copy counts as CSV';

const copyToClipboard = async (text, callback) => {
  await navigator.clipboard.writeText(text);
  callback();
}

function Stats({
  stats: { totalMoves, countsForReturn, countsForTour },
  visitCounts,
}) {
  const [hasCopied, setHasCopied] = useState(false);
  const [buttonText, setButtonText] = useState(BUTTON_TEXT);
  const timeoutId = useRef(null);

  useEffect(() => {
    if (hasCopied) {
      timeoutId.current = window.setTimeout(() => {
        setButtonText(BUTTON_TEXT);
        setHasCopied(false);
      }, 700);
    }
    return () => {
      if (hasCopied) {
        window.clearTimeout(timeoutId.current);
      }
    }
  }, [hasCopied]);
  /*  useEffect(() => {
    setPrevTotalMoves(totalMoves);
    return () => {
    if (totalMoves === prevTotalMoves && timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
    }
  }}, [totalMoves, prevTotalMoves, setPrevTotalMoves]);
*/
  let visitCountsString = visitCounts
    .slice(0)
    .reverse()
    .map(
      (rankCounts) => rankCounts.join(',')
    )
    .join(EOL);
  visitCountsString += EOL;

  const handleCopy = () => {
    copyToClipboard(
      visitCountsString,
      () => {
        setButtonText('Copied!');
        setHasCopied(true);
      }
    );
  }

  return (
    <div>
      <StatsSection
        id="returnsToInitial"
        heading="To initial square"
        array={countsForReturn}
      />
      <StatsSection
        id="tours"
        heading="To all squares"
        array={countsForTour}
      />
      <div>
        <label id="totalMoves" className="inline" htmlFor="totalMoves">Total moves:</label>
        <span aria-labelledby="totalMoves">{totalMoves.toString()}</span>
      </div>
      <button type="button" className="button button-link" onClick={handleCopy}>
        {buttonText}
      </button>
    </div>
  );
}

export default Stats;
