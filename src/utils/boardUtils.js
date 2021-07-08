import { Vector, checkIfBIsNotOutsideAAndC } from './mathUtils';
import { ALPHABET } from '../constants';

const getFileName = fileIndex => ALPHABET[fileIndex];
const getRankName = rankIndex => (rankIndex + 1).toString();
const getSquareName = (fileIndex, rankIndex) =>
  getFileName(fileIndex) + getRankName(rankIndex);
const parseSquareName = (squareName) => ({
  fileIndex: ALPHABET.split('').indexOf(squareName[0]),
  rankIndex: parseInt(squareName[1], 10) - 1
});


const checkIfLegal = (fileIndex, rankIndex, totalFiles, totalRanks) =>
  checkIfBIsNotOutsideAAndC(0, fileIndex, totalFiles - 1)
    && checkIfBIsNotOutsideAAndC(0, rankIndex, totalRanks - 1);

let memoizedMoves = { prevDimsString: '0x0' };
const resetMemoizedMoves = (newDimsString) =>{
  memoizedMoves = { prevDimsString: newDimsString };
};

const getLegalMoves = (fileIndex, rankIndex, totalFiles, totalRanks) => {
  const squareName = getSquareName(fileIndex, rankIndex);
  const boardDims = [totalFiles, totalRanks];

  const dimsString = [totalFiles, totalRanks].join('x');
  if (dimsString !== memoizedMoves.prevDimsString) {
    resetMemoizedMoves(dimsString);
  }

  if (Array.isArray(memoizedMoves[squareName])) return memoizedMoves[squareName];

  const startSquare = new Vector(fileIndex, rankIndex);
  const moves = [];
  const { PI, cos, sin, round } = Math;

  // each iteration goes out two squares, then sideways plus/minus one square
  // start at 0 degrees, increase by 90 degrees, stop before 360 degrees
  for (let theta = 0; theta < 2 * PI; theta += PI / 2) {
    // start iterating for (1, 0), then (0, 1)...
    const firstOffset = new Vector(round(cos(theta)), round(sin(theta)));
    const twoSquareOffset = firstOffset.times(2);
    const twoStepSquare = startSquare.plus(twoSquareOffset);

    if (checkIfLegal(...twoStepSquare.array, ...boardDims)) {
      const secondOffset = firstOffset.reverse();
      const firstEndIndices = twoStepSquare.plus(secondOffset).array;
      const secondEndIndices = twoStepSquare.plus(secondOffset.times(-1)).array;

      if (checkIfLegal(...firstEndIndices, ...boardDims)) {
        moves.push(firstEndIndices);
      };
      if (checkIfLegal(...secondEndIndices, ...boardDims)) {
        moves.push(secondEndIndices);
      }
    }
  }

  memoizedMoves[squareName] = moves;
  return moves;
}

export {
  getLegalMoves,
  getSquareName,
  getRankName,
  getFileName,
  parseSquareName,
  checkIfLegal
};
