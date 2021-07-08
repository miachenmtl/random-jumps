const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const SPEED_MAP = new Map([
  ['Walk', 600],
  ['Trot', 300],
  ['Canter', 200],
  ['Gallop', 100],
  ['Jet', 10],
  ['Warp', 1]
]);

const MIN_INTERVAL = 100;

const MIN_BOARD_LENGTH = 5;
const MAX_BOARD_LENGTH = 12;

const CANVAS_WIDTH = 500;

export {
  ALPHABET,
  SPEED_MAP,
  MIN_INTERVAL,
  CANVAS_WIDTH,
  MIN_BOARD_LENGTH,
  MAX_BOARD_LENGTH
};
