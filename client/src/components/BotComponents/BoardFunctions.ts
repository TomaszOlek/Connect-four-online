import { MinMaxType } from "../Types/BotComponentsTypes"
import { roomType } from "../../reducers/roomData"

const coppyBoard = (board: Array<Array<0 | 1 | 2>>): Array<Array<0 | 1 | 2>> => {
  return (JSON.parse(JSON.stringify(board)))
}

export const getNextMove = async (board: Array<Array<0 | 1 | 2>>, difficulty: number) => {

  const minMaxObject: MinMaxType = {
    board: coppyBoard(board),
    depth: difficulty,  //If the difficulty is higher than 7 the function slows down drastically
    playerMove: { score: -9999999 },
    botMove: { score: 9999999 },
    maximizingPlayer: false
  };
  return MinMax(minMaxObject);
}

//
const placeMove = (newBoard: Array<Array<0 | 1 | 2>>, player: 1 | 2, columnMove: number) => {
  let lastIndex = newBoard[columnMove].lastIndexOf(0);
  if (lastIndex !== -1) {
    newBoard[columnMove].splice(lastIndex, 1, player);
    return newBoard
  }
  return false
}

const MinMax = ({ board, depth, playerMove, botMove, maximizingPlayer }: MinMaxType) => {
  let currentScore = getScore(board);
  let possibleMoves = [];

  //Check all posible moves if it's posible then add it to possibleMoves
  let player: 1 | 2 = maximizingPlayer ? 1 : 2;
  for (let column = 0; column < 7; column++) {
    let nextPossibleBoard = placeMove(coppyBoard(board), player, column);
    if (nextPossibleBoard) possibleMoves[column] = nextPossibleBoard;
  };

  let isDrawn = possibleMoves.length === 0;

  if (depth == 0 || isDrawn || currentScore <= -100000 || currentScore >= 100000) {
    let leaf = {
      columnMove: null,
      score: currentScore
    };
    return leaf
  }

  if (maximizingPlayer) {
    var recursionScore: any = {
      columnMove: null,
      score: -99999
    }
  } else {
    var recursionScore: any = {
      columnMove: null,
      score: 99999
    }
  }

  for (let i = 0; i <= possibleMoves.length - 1; i++) {
    if (!possibleMoves[i]) continue;
    const minMaxObject: MinMaxType = {
      board: possibleMoves[i],
      depth: depth - 1,
      playerMove: playerMove,
      botMove: botMove,
      maximizingPlayer: !maximizingPlayer
    };
    let nextmove = MinMax(minMaxObject);

    if (maximizingPlayer ? nextmove.score > recursionScore.score : nextmove.score < recursionScore.score || recursionScore.columnMove == null) {
      recursionScore.columnMove = i;
      recursionScore.score = nextmove.score;
    }

    if (maximizingPlayer) {
      playerMove = max(playerMove, nextmove);
    } else {
      botMove = min(botMove, nextmove);
    }

    if (botMove.score <= playerMove.score) {
      break;
    }
  };

  return recursionScore;
}

type leaf = {
  columnMove?: number | null,
  score: number
}

const min = function (x: leaf, y: leaf) {
  return x.score < y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y));
}

const max = function (x: leaf, y: leaf) {
  return x.score > y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y))
}

const getScore = function (board: Array<Array<0 | 1 | 2>>): number {
  let score = 0;

  function updateScore(HumanInRow: number, ComputerInRow: number) {
    let points = 0;
    switch (HumanInRow) {
      case 4:
        points += 100000;
        break;
      case 3:
        points += 5;
        break;
      case 2:
        points += 1;
        break;
      default:
        break
    }
    switch (ComputerInRow) {
      case 4:
        points -= 100000;
        break;
      case 3:
        points -= 5;
        break;
      case 2:
        points -= 1;
        break;
      default:
        break
    }
    return points;
  }

  //Check ROWS
  for (let row = 0; row < 6; row++) {
    for (let column = 0; column <= 5 - 4; column++) {
      let HumanInRow = 0, ComputerInRow = 0;
      for (let offset = column; offset < column + 4; offset++) {
        if (board[row][offset] == 1) {
          HumanInRow++;
          ComputerInRow = 0
        } else if (board[row][offset] == 2) {
          ComputerInRow++;
          HumanInRow = 0
        }
      }
      score += updateScore(HumanInRow, ComputerInRow);
      if (score <= -100000 || score >= 100000) return score;
    }
  }

  //Check COLUMNS
  for (let column = 0; column < 7; column++) {
    for (let row = 0; row <= 6 - 4; row++) {
      let HumanInRow = 0, ComputerInRow = 0;
      for (let offset = row; offset < row + 4; offset++) {
        if (board[offset][column] == 1) {
          HumanInRow++;
          ComputerInRow = 0
        } else if (board[offset][column] == 2) {
          ComputerInRow++;
          HumanInRow = 0
        }
      }
      score += updateScore(HumanInRow, ComputerInRow);
      if (score <= -100000 || score >= 100000) return score;
    }
  }

  //Check DIAGONALS
  for (let column = 0; column <= 7 - 4; column++) {
    for (let row = 0; row <= 6 - 4; row++) {
      let HumanInRow = 0, ComputerInRow = 0;
      for (let offset = row; offset < row + 4; offset++) {
        if (board[offset][(offset - row) + column] == 1) {
          HumanInRow++;
          ComputerInRow = 0
        } else if (board[offset][(offset - row) + column] == 2) {
          ComputerInRow++;
          HumanInRow = 0
        }
      }
      score += updateScore(HumanInRow, ComputerInRow);
      if (score <= -100000 || score >= 100000) return score;
    }
  }
  for (let column = 7 - 1; column >= 7 - 4; column--) {
    for (let row = 0; row <= 6 - 4; row++) {
      let HumanInRow = 0, ComputerInRow = 0;
      for (let offset = row; offset < row + 4; offset++) {
        if (board[offset][column - (offset - row)] == 1) {
          HumanInRow++;
          ComputerInRow = 0
        } else if (board[offset][column - (offset - row)] == 2) {
          ComputerInRow++;
          HumanInRow = 0
        }
      }
      score += updateScore(HumanInRow, ComputerInRow);
      if (score <= -100000 || score >= 100000) return score;
    }
  }

  return score;
}

export const handleChipDrop = (room: roomType, index: number) => {
  const selectedRow = room.game.board[index]

  let lastIndex = selectedRow.lastIndexOf(0);
  selectedRow.splice(lastIndex, 1, room.game.playerTurn.playerIndex);

  const winerPlayerOrDraw = checkForWin(room.game.board)

  if (!winerPlayerOrDraw) {
    room.game.playerTurn = room.game.playerTurn.playerIndex === 1 ?
      {
        playerName: "Bot",
        playerIndex: 2,
      } : {
        playerName: "Player",
        playerIndex: 1,
      }

    return room
  }
  room.game.state = "gameEnded"
  room.game.score.lastWin = winerPlayerOrDraw

  if (winerPlayerOrDraw === 1) {
    ++room.game.score.playerOneWins
  } else if (winerPlayerOrDraw === 2) {
    ++room.game.score.playerTwoWins
  } else {
    ++room.game.score.playerOneWins
    ++room.game.score.playerTwoWins
  }

  return room
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
        return null;
      }
    }
  }

  // Game is a draw
  return "draw";
};