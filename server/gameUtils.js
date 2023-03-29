export const generateNewBoard = () => [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, 2, 1],
]

export const deepCloneBoard = (board) => [
  [...board[0]],
  [...board[1]],
  [...board[2]],
  [...board[3]],
  [...board[4]],
  [...board[5]],
  [...board[6]],
  [...board[7]],
]

export const handelChipDrop = (board, currentRoom, selectedRow, index) => {
  let lastIndex = selectedRow.lastIndexOf(null);
  selectedRow.splice(lastIndex, 1, currentRoom.game.playerTurn.playerIndex);
  board[index] = selectedRow
  return board
}

const checkVertical = (board) => {
  // Check only if row is 3 or greater
  // for (let r = 3; r < 6; r++) {
  //   for (let c = 0; c < 7; c++) {
  //     if (board[r][c]) {
  //       if (
  //         board[r][c] === board[r - 1][c] &&
  //         board[r][c] === board[r - 2][c] &&
  //         board[r][c] === board[r - 3][c]
  //       ) {
  //         return board[r][c]
  //       }
  //     }
  //   }
  // }
}

const checkHorizontal = (board) => {
  // Check only if column is 3 or less
  // for (let r = 0; r < 6; r++) {
  //   for (let c = 0; c < 4; c++) {
  //     if (board[r][c]) {
  //       if (
  //         board[r][c] === board[r][c + 1] &&
  //         board[r][c] === board[r][c + 2] &&
  //         board[r][c] === board[r][c + 3]
  //       ) {
  //         return board[r][c]
  //       }
  //     }
  //   }
  // }
}

const checkDiagonalRight = (board) => {
  // Check only if row is 3 or greater AND column is 3 or less
  // for (let r = 3; r < 6; r++) {
  //   for (let c = 0; c < 4; c++) {
  //     if (board[r][c]) {
  //       if (
  //         board[r][c] === board[r - 1][c + 1] &&
  //         board[r][c] === board[r - 2][c + 2] &&
  //         board[r][c] === board[r - 3][c + 3]
  //       ) {
  //         return board[r][c]
  //       }
  //     }
  //   }
  // }
}

const checkDiagonalLeft = (board) => {
  // Check only if row is 3 or greater AND column is 3 or greater
  // for (let r = 3; r < 6; r++) {
  //   for (let c = 3; c < 7; c++) {
  //     if (board[r][c]) {
  //       if (
  //         board[r][c] === board[r - 1][c - 1] &&
  //         board[r][c] === board[r - 2][c - 2] &&
  //         board[r][c] === board[r - 3][c - 3]
  //       ) {
  //         return board[r][c]
  //       }
  //     }
  //   }
  // }
}

const checkDraw = (board) => {
  // for (let r = 0; r < 6; r++) {
  //   for (let c = 0; c < 7; c++) {
  //     if (board[r][c] === null) {
  //       return null
  //     }
  //   }
  // }
  // return 'draw'
}

export const checkForWin = (board) => {
  return (
    checkVertical(board) ||
    checkDiagonalRight(board) ||
    checkDiagonalLeft(board) ||
    checkHorizontal(board) ||
    checkDraw(board)
  )
}