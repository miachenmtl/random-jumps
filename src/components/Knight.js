// import { ReactComponent as KnightSvg } from '../assets/Chess_ndt45.svg';
import knightSvg from "../assets/Chess_ndt45.svg";

// svg from WikiCommons, importing for img element to add alt text
/*
  By en:User:Cburnett - Own work
  This W3C-unspecified vector image was created with Inkscape .,
  CC BY-SA 3.0,
  https://commons.wikimedia.org/w/index.php?curid=1499807
*/

function Knight({
  squareWidth,
  visualRankIndex,
  fileIndex,
  interval,
  setIsDragging,
  isDraggable,
  isResizing,
  isManual,
  isClicked,
  setClickedSquare,
  unsetClickedSquare,
}) {
  const transitionValue = isResizing ? "none" : `all ${interval / 2}ms`;
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", `${fileIndex},${visualRankIndex}`);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    setIsDragging(true);
    if (isManual) setClickedSquare(fileIndex, visualRankIndex);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  let handleClick;
  if (isManual) {
    handleClick = isClicked
      ? () => {
          unsetClickedSquare();
        }
      : () => {
          setClickedSquare(fileIndex, visualRankIndex);
        };
  }

  let cursor = "default";
  if (isManual) cursor = "pointer";
  else if (isDraggable) cursor = "grab";

  return (
    <div
      className="piece"
      style={{
        width: squareWidth,
        height: squareWidth,
        left: squareWidth * fileIndex,
        top: squareWidth * visualRankIndex,
        transition: transitionValue,
        cursor: cursor,
      }}
      role="button"
      onClick={handleClick}
    >
      <img
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        width={0.7 * squareWidth}
        height={0.7 * squareWidth}
        src={knightSvg}
        alt="Knight"
      />
    </div>
  );
}

export default Knight;
