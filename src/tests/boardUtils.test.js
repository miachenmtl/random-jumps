import {
  getLegalMoves,
  getSquareName,
  getRankName,
  getFileName,
  parseSquareName,
}from '../utils/boardUtils';
import { checkIfBIsNotOutsideAAndC } from '../utils/mathUtils';

function checkIfLegal(fileIndex, rankIndex) {
  const hasLegalFile = checkIfBIsNotOutsideAAndC(0, fileIndex, 7);
  const hasLegalRank = checkIfBIsNotOutsideAAndC(0, rankIndex, 7);
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
