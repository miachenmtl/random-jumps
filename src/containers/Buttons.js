import { useState, useEffect, useRef } from "react";

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
}) {
  const dimsString = `${totalFiles}x${totalRanks}`;
  const [prevDimsString, setPrevDimsString] = useState(dimsString);
  const [intervalId, setIntervalId] = useState(null);
  const [prevInterval, setPrevInterval] = useState(interval);
  const resetRef = useRef(null);
  useEffect(() => {
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
        disabled={intervalId !== null}
        className="panel-button"
        onClick={handleStart}
        type="button"
      >
        Start
      </button>
      <button
        disabled={intervalId === null}
        className="panel-button"
        onClick={handleStop}
        type="button"
      >
        Stop
      </button>
      <button
        ref={resetRef}
        className="panel-button"
        onClick={handleReset}
        type="button"
      >
        Reset
      </button>
    </>
  );
}

export default Buttons;
