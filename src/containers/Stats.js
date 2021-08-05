import { useState, useContext } from "react";
import { EOL } from "os";

import StatsSection from "../components/StatsSection";
import strings from "../strings";
import LangContext from "../LangContext";
import useCopy from "../utils/useCopy";

const { TO_INITIAL, TO_ALL, TOTAL_MOVES, COPIED, COPY_BOARD } = strings;

function Stats({
  stats: { totalMoves, countsForReturn, countsForTour },
  visitCounts,
}) {
  const { lang } = useContext(LangContext);

  const [buttonText, setButtonText] = useState(COPY_BOARD[lang]);

  let visitCountsString = visitCounts
    .slice(0)
    .reverse()
    .map((rankCounts) => rankCounts.join(","))
    .join(EOL);
  visitCountsString += EOL;

  const handleCopy = useCopy(
    () => {
      setButtonText(COPIED[lang]);
    },
    () => {
      setButtonText(COPY_BOARD[lang]);
    },
    lang
  );
  const handleClick = () => {
    handleCopy(visitCountsString);
  };

  return (
    <div>
      <StatsSection
        id="returnsToInitial"
        heading={TO_INITIAL[lang]}
        array={countsForReturn}
      />
      <StatsSection id="tours" heading={TO_ALL[lang]} array={countsForTour} />
      <div>
        <label id="totalMoves" className="inline" htmlFor="totalMoves">
          {TOTAL_MOVES[lang]}
        </label>
        <span aria-labelledby="totalMoves">{totalMoves.toString()}</span>
      </div>
      <button
        type="button"
        className="button button-link"
        onClick={handleClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Stats;
