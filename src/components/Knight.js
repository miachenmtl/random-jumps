import { ReactComponent as KnightSvg } from '../assets/Chess_ndt45.svg';

// svg from WikiCommons
/*
  By en:User:Cburnett - Own work
  This W3C-unspecified vector image was created with Inkscape .,
  CC BY-SA 3.0,
  https://commons.wikimedia.org/w/index.php?curid=1499807
*/

function Knight({ squareWidth, visualRankIndex, fileIndex, isResizing }) {
  return (
    <div
      className="piece"
      style={{
        width: squareWidth,
        height: squareWidth,
        left: squareWidth * fileIndex,
        top: squareWidth * visualRankIndex,
        transition: isResizing ? 'none' : 'all 0.2s'
      }}
    >
      <KnightSvg
        viewBox="5 5 35 35"
        width={0.6 * squareWidth}
        height={0.6 * squareWidth}
        alt="knight"
      />
    </div>
  );
}

export default Knight;