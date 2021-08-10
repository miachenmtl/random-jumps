import { Vector, checkIfBIsNotOutsideAAndC } from '../utils/mathUtils';
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
describe('The checkIfBIsNotOutsideAAndC util', () => {
  it('returns false when b is outside a and c', () => {
    expect(checkIfBIsNotOutsideAAndC(3, 1, 5)).toBe(false);
    expect(checkIfBIsNotOutsideAAndC(3, 7, 5)).toBe(false);
  });
  it('returns true when inside or equal to and c', () => {
    expect(checkIfBIsNotOutsideAAndC(3, 3, 5)).toBe(true);
    expect(checkIfBIsNotOutsideAAndC(3, 4, 5)).toBe(true);
    expect(checkIfBIsNotOutsideAAndC(3, 5, 5)).toBe(true);
  });
});