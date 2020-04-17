import Board from './src/Board';

/*
 * We have 3 boards: led1, led2, mic(soon)
 */

// Leds Boards
const led1Board = new Board({
  name: 'led1',
  host: '192.168.1.157',
  port: 3030,
});

const led2Board = new Board({
  name: 'led2',
  host: '192.168.1.158',
  port: 3030,
});

// Definitions
const LED_PIN = 2;
let LED_STATE = 1;
const BOARDS_LIST = [];

// On Led Board 1 Ready
led1Board.onReady(function (board) {
  BOARDS_LIST.push(board);

  // return a function to cancel methods on board disconnecting.
  return () => {
    if (BOARDS_LIST.indexOf(board) > -1)
      BOARDS_LIST.splice(BOARDS_LIST.indexOf(board), 1);
  };
});

// On Led Board 2 Ready
led2Board.onReady(function (board) {
  BOARDS_LIST.push(board);

  // return a function to cancel methods on board disconnecting.
  return () => {
    if (BOARDS_LIST.indexOf(board) > -1)
      BOARDS_LIST.splice(BOARDS_LIST.indexOf(board), 1);
  };
});

// Loop Function
setInterval(() => {
  // eslint-disable-next-line no-bitwise
  LED_STATE ^= 1;
  BOARDS_LIST.forEach((board) => {
    board.pinMode(LED_PIN, board.MODES.OUTPUT);
    board.digitalWrite(LED_PIN, LED_STATE);
  });
}, 500);
