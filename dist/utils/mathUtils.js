const Vector = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.array = [x, y];
  }

  plus = addedVector => {
    const newCoords = [this.x + addedVector.x, this.y + addedVector.y];
    return new Vector(...newCoords);
  };
  times = multipliedScalar => {
    const newCoords = [multipliedScalar * this.x, multipliedScalar * this.y];
    return new Vector(...newCoords);
  };
  reverse = () => {
    return new Vector(this.y, this.x);
  };
};

function checkIfBIsNotOutsideAAndC(a, b, c) {
  return a <= b && b <= c;
}

export { Vector, checkIfBIsNotOutsideAAndC };