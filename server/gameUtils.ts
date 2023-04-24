export const generateNewBoard = (): (0 | 1 | 2)[][] => [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
]

export const handleChipDrop = (board, currentRoom, selectedRow, index) => {
  let lastIndex = selectedRow.lastIndexOf(0);
  selectedRow.splice(lastIndex, 1, currentRoom.game.playerTurn.playerIndex);
  board[index] = selectedRow
  return board
}

export const checkForWin = (board: Array<Array<0 | 1 | 2>>) => {
  const numRows = board.length;
  const numCols = board[0].length;

  // Check vertical
  for (let r = 0; r < numRows - 3; r++) {
    for (let c = 0; c < numCols; c++) {
      if (
        board[r][c] !== 0 &&
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
        board[r][c] !== 0 &&
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
        board[r][c] !== 0 &&
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
        board[r][c] !== 0 &&
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
      if (board[r][c] === 0) {
        // Game is not over yet
        return 0;
      }
    }
  }

  // Game is a draw
  return "draw";
};