import { useState, useContext } from "react";
import { EOL } from "os";
import StatsSection from "../components/StatsSection";
import strings from "../strings";
import LangContext from "../LangContext";
import useCopy from "../utils/useCopy";
const {
  TO_INITIAL,
  TO_ALL,
  TOTAL_MOVES,
  COPIED,
  COPY_BOARD
} = strings;

function Stats({
  stats: {
    totalMoves,
    countsForReturn,
    countsForTour
  },
  visitCounts
}) {
  const {
    lang
  } = useContext(LangContext);
  const [buttonText, setButtonText] = useState(COPY_BOARD[lang]);
  let visitCountsString = visitCounts.slice(0).reverse().map(rankCounts => rankCounts.join(",")).join(EOL);
  visitCountsString += EOL;
  const handleCopy = useCopy(() => {
    setButtonText(COPIED[lang]);
  }, () => {
    setButtonText(COPY_BOARD[lang]);
  }, lang);

  const handleClick = () => {
    handleCopy(visitCountsString);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StatsSection, {
    id: "returnsToInitial",
    heading: TO_INITIAL[lang],
    array: countsForReturn
  }), /*#__PURE__*/React.createElement(StatsSection, {
    id: "tours",
    heading: TO_ALL[lang],
    array: countsForTour
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    id: "totalMoves",
    className: "inline",
    htmlFor: "totalMoves"
  }, TOTAL_MOVES[lang]), /*#__PURE__*/React.createElement("span", {
    "aria-labelledby": "totalMoves"
  }, totalMoves.toString())), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button button-link",
    onClick: handleClick
  }, buttonText));
}

export default Stats;