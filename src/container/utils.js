const Vector = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.array = [x, y];
  }

  plus = (addedVector) => {
    const newCoords = [this.x + addedVector.x, this.y + addedVector.y];
    return new Vector(...newCoords);
  }

  times = (multipliedScalar) => {
    const newCoords = [multipliedScalar * this.x, multipliedScalar * this.y];
    return new Vector(...newCoords);
  }

  reverse = () => {
    return new Vector(this.y, this.x);
  }
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const getFileName = fileIndex => ALPHABET[fileIndex];
const getRankName = rankIndex => (rankIndex + 1).toString();
const getSquareName = (fileIndex, rankIndex) =>
  getFileName(fileIndex) + getRankName(rankIndex);
const parseSquareName = (squareName) => ({
  fileIndex: ALPHABET.split('').indexOf(squareName[0]),
  rankIndex: parseInt(squareName[1], 10) - 1
});


const memoizedMoves = {};

const getLegalMoves = (fileIndex, rankIndex, checkIfLegal) => {
  const squareName = getSquareName(fileIndex, rankIndex);
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

    if (checkIfLegal(...twoStepSquare.array)) {
      const secondOffset = firstOffset.reverse();
      const firstEndIndices = twoStepSquare.plus(secondOffset).array;
      const secondEndIndices = twoStepSquare.plus(secondOffset.times(-1)).array;

      if (checkIfLegal(...firstEndIndices)) moves.push(firstEndIndices);
      if (checkIfLegal(...secondEndIndices)) moves.push(secondEndIndices);
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
  Vector
};
