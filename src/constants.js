import strings from "./strings";

const { SPEED_NAMES } = strings;

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const SPEED_MAP = new Map([
  [SPEED_NAMES[0], 600],
  [SPEED_NAMES[1], 300],
  [SPEED_NAMES[2], 200],
  [SPEED_NAMES[3], 100],
  [SPEED_NAMES[4], 10],
  [SPEED_NAMES[5], 1],
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
  MAX_BOARD_LENGTH,
};
