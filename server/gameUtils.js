export const generateNewBoard = () => [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
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

export const handleChipDrop = (board, currentRoom, selectedRow, index) => {
  let lastIndex = selectedRow.lastIndexOf(null);
  selectedRow.splice(lastIndex, 1, currentRoom.game.playerTurn.playerIndex);
  board[index] = selectedRow
  return board
}

export const checkForWin = (board) => {
  const numRows = board.length;
  const numCols = board[0].length;

  // Check vertical
  for (let r = 0; r < numRows - 3; r++) {
    for (let c = 0; c < numCols; c++) {
      if (
        board[r][c] !== null &&
        board[r][c] === board[r + 1][c] &&
        board[r][c] === board[r + 2][c] &&
        board[r][c] === board[r + 3][c]
      ) {
        return board[r][c];
      }
    }
  }

  // Check horizontal
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols - 3; c++) {
      if (
        board[r][c] !== null &&
        board[r][c] === board[r][c + 1] &&
        board[r][c] === board[r][c + 2] &&
        board[r][c] === board[r][c + 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let r = 0; r < numRows - 3; r++) {
    for (let c = 0; c < numCols - 3; c++) {
      if (
        board[r][c] !== null &&
        board[r][c] === board[r + 1][c + 1] &&
        board[r][c] === board[r + 2][c + 2] &&
        board[r][c] === board[r + 3][c + 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let r = 0; r < numRows - 3; r++) {
    for (let c = 3; c < numCols; c++) {
      if (
        board[r][c] !== null &&
        board[r][c] === board[r + 1][c - 1] &&
        board[r][c] === board[r + 2][c - 2] &&
        board[r][c] === board[r + 3][c - 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check for draw
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (board[r][c] === null) {
        // Game is not over yet
        return null;
      }
    }
  }

  // Game is a draw
  return "draw";
};