import { useState, useEffect, useRef } from 'react';
import Settings from './Settings';

import { MIN_INTERVAL } from '../constants';

const startTimer = (interval, makeRandomMoves, setIntervalId) => {
  const totalNewMoves = Math.max(1, MIN_INTERVAL / interval);
  const newIntervalId = window.setInterval(
    () => { makeRandomMoves(totalNewMoves); },
  Math.max(MIN_INTERVAL, interval));
  setIntervalId(newIntervalId);
};

function Panel({
  makeRandomMoves,
  resetBoard,
  interval,
  speedNames,
  speedIndex,
  setSpeed,
  displaySettings,
  toggleDisplaySettings,
  isMoving,
  setIsMoving
}) {
  const [intervalId, setIntervalId] = useState(null);
  const [prevInterval, setPrevInterval] = useState(interval);
  const resetRef = useRef(null);

  useEffect(() => {
    if ((interval !== prevInterval) && isMoving) {
      window.clearInterval(intervalId);
      startTimer(interval, makeRandomMoves, setIntervalId)
      setPrevInterval(interval);
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    }
  }, [intervalId, interval, isMoving, prevInterval, makeRandomMoves]);

  const handleStart = () => {
    startTimer(interval, makeRandomMoves, setIntervalId);
    setIsMoving(true);
  };
  const handleStop = () => {
    window.clearInterval(intervalId);
    setIsMoving(false);
    setIntervalId(null);
  }
  const handleReset = () => {
    if (isMoving) handleStop();
    resetBoard();
    resetRef.current.blur();
  }
  const handleSpeed = ({ target: { value } }) => {
    const isAlreadyMoving = isMoving;
    if (isAlreadyMoving) handleStop();
    setSpeed(value);
    if (isAlreadyMoving) handleStart();
  }

  return (
    <div className="panel">
      <button disabled={isMoving} className="button" onClick={handleStart} type="button">
        Start
      </button>
      <button disabled={!isMoving} onClick={handleStop} type="button">
        Stop
      </button>
      <button ref={resetRef} onClick={handleReset} type="button">
        Reset
      </button>
      <Settings
        speedNames={speedNames}
        speedIndex={speedIndex}
        handleSpeed={handleSpeed}
        displaySettings={displaySettings}
        toggleDisplaySettings={toggleDisplaySettings}
      />
    </div>
  )
}

export default Panel;
