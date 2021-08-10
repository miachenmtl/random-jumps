import { useState } from "react";

const Square = ({
  visitCount,
  maxSquareCount,
  squareName,
  getHeatmapHexString,
  setDropSquare,
  makeManualMove,
  unsetClickedSquare,
  isCurrent,
  isDragging,
  isTarget,
  isManual,
  displaySettings: {
    showCount,
    showPercent,
    showHeatmap,
    showHighlight
  }
}) => {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const ratio = visitCount / maxSquareCount;
  const percentText = `${Math.round(100 * ratio)}%`;
  const style = showHeatmap ? {
    backgroundColor: getHeatmapHexString(ratio)
  } : null;

  const handleDragOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (!isDropTarget && (!isManual || isTarget)) {
      setIsDropTarget(true);
    }
  };

  const handleDragLeave = event => {
    event.preventDefault();
    setIsDropTarget(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsDropTarget(false);
    if (isManual && isTarget) makeManualMove(squareName);else if (!isManual) setDropSquare(squareName);
  };

  let handleClick;

  if (isManual) {
    if (isTarget) {
      handleClick = () => {
        makeManualMove(squareName);
      };
    } else {
      handleClick = () => {
        unsetClickedSquare();
      };
    }
  }

  let tdClass = isCurrent && showHighlight ? "current" : undefined;

  if (tdClass === "current" && isDragging) {
    tdClass += " dragged";
  }

  if (isDropTarget || isTarget) {
    tdClass = "drop-target";
  }

  return /*#__PURE__*/React.createElement("td", {
    className: tdClass,
    title: squareName,
    onDragEnter: handleDragOver,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onClick: handleClick,
    style: style
  }, showPercent && /*#__PURE__*/React.createElement("span", {
    className: "percent"
  }, percentText), showCount && /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, visitCount));
};

export default Square;