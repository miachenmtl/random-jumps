import {
  getLegalMoves,
  getSquareName,
  getRankName,
  getFileName,
  parseSquareName,
  Vector
}from '../container/utils';

// FIXME getLegalMoves needs a callback from the Main container which this replaces
// DRY this
function checkIfLegal(fileIndex, rankIndex) {
  const hasLegalFile = (0 <= fileIndex) && (fileIndex <= 7);
  const hasLegalRank = (0 <= rankIndex) && (rankIndex <= 7);
  return hasLegalFile && hasLegalRank;
}

describe('The getFileName function', () => {
  it('takes an index number and returns the corresponding letter for a file', () => {
    const expected = 'd';
    const actual = getFileName(3);
    expect(actual).toEqual(expected);
  });
});

describe('The getRankName function', () => {
  it('takes an index number and returns the corresponding 1-based rank number as a string', () => {
    const expected = '3';
    const actual = getRankName(2);
    expect(actual).toEqual(expected);
  });
});

describe('The getSquareName function', () => {
  it('takes two index numbers and returns the corresponding square name', () => {
    const expected = 'f3';
    const actual = getSquareName(5, 2);
    expect(actual).toEqual(expected);
  });
});

describe('The parseSquareName function', () => {
  it('takes a square name and returns the corresponding file and rank indices', () => {
    const expected = {
      fileIndex: 5,
      rankIndex: 2
    };
    const actual = parseSquareName('f3');
    expect(actual).toEqual(expected);
  });
});

describe('The getLegalSquares function', () => {
  it('gets the two legal moves from the a1 square', () => {
    const expected = new Set(['c2', 'b3']);
    const newMoves = getLegalMoves(0, 0, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    const actual = new Set(newMoves);
    expect(actual).toEqual(expected);
  });

  it('gets the eight legal moves from the e4 square', () => {
    // e file has fileIndex 4, 4th rank has rankIndex 3
    const expected = new Set(['d6', 'f6', 'c5', 'g5', 'c3', 'g3', 'd2', 'f2']);
    const newMoves = getLegalMoves(4, 3, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    const actual = new Set(newMoves);
    expect(actual).toEqual(expected);
  });

  it('gets the three legal moves from the g8 square', () => {
    const expected = new Set(['f6', 'e7', 'h6']);
    const newMoves = getLegalMoves(6, 7, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    const actual = new Set(newMoves);
    expect(actual).toEqual(expected);
  });

  it('returns pre-calculated moves if called with the same square', () => {
    const spy = jest.spyOn(Math, 'cos');
    expect(spy).not.toHaveBeenCalled();
    const newMoves = getLegalMoves(1, 0, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    expect(spy).toHaveBeenCalled();
    const totalCalls = spy.mock.calls.length;
    const newerMoves = getLegalMoves(1, 0, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    expect(spy).toHaveBeenCalledTimes(totalCalls);
    expect(newerMoves).toEqual(newMoves);
    getLegalMoves(1, 2, checkIfLegal).map(([x, y]) => getSquareName(x, y));
    expect(spy.mock.calls.length).toBeGreaterThan(totalCalls);
  });
});

describe('The Vector class', () => {
  it('can pairwise add two 2d vectors', () => {
    const expected = [5, 3];
    const A = new Vector(3, 5);
    const B = new Vector(2, -2);
    const actual = A.plus(B).array;
    expect(actual).toEqual(expected);
  });

  it('can multiply a two 2d vector by a scalar', () => {
    const expected = [6, 10];
    const A = new Vector(3, 5);
    const B = 2;
    const actual = A.times(B).array;
    expect(actual).toEqual(expected);
  });

  it('can reverse (x, y) to (y, x)', () => {
    const expected = [6, 10];
    const A = new Vector(10, 6);
    const actual = A.reverse().array;
    expect(actual).toEqual(expected);
  });
});
