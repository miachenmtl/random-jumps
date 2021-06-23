import { useState, useEffect, useRef } from 'react';

function Panel({ makeRandomMove, setIsMoving, resetBoard, isMoving }) {
  const [intervalId, setIntervalId] = useState(null);
  const resetRef = useRef(null);

  useEffect(() => {
    // do nothing but clear timer when unmounting
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    }
  }, [intervalId]);

  const handleStart = () => {
    if (!isMoving) {
      const newIntervalId = window.setInterval(() => { makeRandomMove(); }, 500);
      setIsMoving(true);
      setIntervalId(newIntervalId);
    }
  }
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

/*
TODO: change speed
show/hide knight
heatmap view
percent view
show total moves
as collapsible settings
change dimensions
*/

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
    </div>
  )
}

export default Panel;
