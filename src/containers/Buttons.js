import { useState, useEffect, useRef, useContext } from "react";

import LangContext from "../LangContext";
import strings from "../strings";
import { MIN_INTERVAL } from "../constants";

const startTimer = (interval, makeRandomMoves, setIntervalId) => {
  const totalNewMoves = Math.max(1, MIN_INTERVAL / interval);
  const newIntervalId = window.setInterval(() => {
    makeRandomMoves(totalNewMoves);
  }, Math.max(MIN_INTERVAL, interval));
  setIntervalId(newIntervalId);
};

function Buttons({
  makeRandomMoves,
  resetBoard,
  interval,
  totalFiles,
  totalRanks,
  isManual,
}) {
  const { lang } = useContext(LangContext);
  const { START, STOP, RESET } = strings;

  const dimsString = `${totalFiles}x${totalRanks}`;
  const [prevDimsString, setPrevDimsString] = useState(dimsString);
  const [intervalId, setIntervalId] = useState(null);
  const [prevInterval, setPrevInterval] = useState(interval);
  const resetRef = useRef(null);
  useEffect(() => {
    if (isManual && intervalId) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    }
    if (intervalId !== null) {
      if (interval !== prevInterval) {
        window.clearInterval(intervalId);
        startTimer(interval, makeRandomMoves, setIntervalId);
      }
      if (dimsString !== prevDimsString) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
    }
    setPrevInterval(interval);
    setPrevDimsString(dimsString);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [
    intervalId,
    interval,
    prevInterval,
    makeRandomMoves,
    prevDimsString,
    dimsString,
    isManual,
  ]);

  const handleStart = () => {
    startTimer(interval, makeRandomMoves, setIntervalId);
  };
  const handleStop = () => {
    window.clearInterval(intervalId);
    setIntervalId(null);
  };
  const handleReset = () => {
    if (intervalId !== null) handleStop();
    resetBoard();
    resetRef.current.blur();
  };

  return (
    <>
      <button
        disabled={isManual || intervalId !== null}
        className="panel-button"
        onClick={handleStart}
        type="button"
      >
        {START[lang]}
      </button>
      <button
        disabled={isManual || intervalId === null}
        className="panel-button"
        onClick={handleStop}
        type="button"
      >
        {STOP[lang]}
      </button>
      <button
        ref={resetRef}
        className="panel-button"
        onClick={handleReset}
        type="button"
      >
        {RESET[lang]}
      </button>
    </>
  );
}

export default Buttons;
