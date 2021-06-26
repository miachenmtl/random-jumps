// import { ReactComponent as KnightSvg } from '../assets/Chess_ndt45.svg';
import knightSvg from '../assets/Chess_ndt45.svg';

// svg from WikiCommons, importing for img element to add alt text
/*
  By en:User:Cburnett - Own work
  This W3C-unspecified vector image was created with Inkscape .,
  CC BY-SA 3.0,
  https://commons.wikimedia.org/w/index.php?curid=1499807
*/

function Knight({ squareWidth, visualRankIndex, fileIndex, interval, isResizing }) {
  const transitionValue = isResizing ? 'none' : `all ${interval / 2}ms`;
  return (
    <div
      className="piece"
      style={{
        width: squareWidth,
        height: squareWidth,
        left: squareWidth * fileIndex,
        top: squareWidth * visualRankIndex,
        transition: transitionValue
      }}
    >
      <img
        width={0.7 * squareWidth}
        height={0.7 * squareWidth}
        src={knightSvg}
        alt="Knight"
      />
      {/*
      <KnightSvg
        title="knight"
        viewBox="5 5 35 35"
        width={0.6 * squareWidth}
        height={0.6 * squareWidth}
      />
      */}
    </div>
  );
}

export default Knight;