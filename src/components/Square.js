import { useState } from "react";

const Square = ({
  visitCount,
  maxSquareCount,
  squareName,
  getHeatmapHexString,
  setDropSquare,
  isCurrent,
  isDragging,
  displaySettings: { showCount, showPercent, showHeatmap, showHighlight },
}) => {
  const [isDropTarget, setIsDropTarget] = useState(false);

  const ratio = visitCount / maxSquareCount;
  const percentText = `${Math.round(100 * ratio)}%`;
  const style = showHeatmap
    ? { backgroundColor: getHeatmapHexString(ratio) }
    : null;

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDropTarget(true);
  };
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDropTarget(false);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDropTarget(false);
    setDropSquare(squareName);
  };

  let tdClass = isCurrent && showHighlight ? "current" : undefined;
  if (tdClass === "current" && isDragging) {
    tdClass += " dragged";
  }
  if (isDropTarget) {
    tdClass += " drop-target";
  }

  return (
    <td
      className={tdClass}
      title={squareName}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={style}
    >
      {showPercent && <span className="percent">{percentText}</span>}
      {showCount && <span className="count">{visitCount}</span>}
    </td>
  );
};

export default Square;
