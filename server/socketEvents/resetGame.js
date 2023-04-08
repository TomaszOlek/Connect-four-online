import { generateNewBoard } from "../gameUtils.js"

const PLAYER_OVERTIME = 20;

const updateRoomAndEmit = (io, room) => {
  io.in(room.lobby).emit("updateRoom", room);
};

function isEven(value) {
  return value % 2 === 0;
}

export default function resetGame(socket, io, lobby, rooms) {
  const room = rooms.find((room) => room.lobby === lobby);
  console.log(`Player ${socket.id} voted to start a new game.`);

  if (!room) {
    console.log(`The room ${lobby} does not exist.`);
    return;
  }

  if (!room.startNewGameVotes) {
    room.startNewGameVotes = {
      votes: 1,
      playersVoted: [socket.id],
    };
    updateRoomAndEmit(io, room);
  } else if (room.startNewGameVotes.playersVoted.includes(socket.id)) {
    console.log(`The player ${socket.id} already voted to start a new game.`);
    return;
  } else {
    room.startNewGameVotes.votes++;
    room.startNewGameVotes.playersVoted.push(socket.id);
    updateRoomAndEmit(io, room);
  }

  console.log(`Votes to start new game: ${room.startNewGameVotes.votes}/${room.players.length}`);

  if (room.startNewGameVotes.votes === room.players.length) {
    setTimeout(() => {
      const wasPlayerOneTurn = isEven(room.game.score.playerOneWins + room.game.score.playerTwoWins);
      console.log(`Player ${room.players[0].id} is ${wasPlayerOneTurn ? "now" : "still"} player one.`);

      room.game.playerTurn = {
        ...room.players[wasPlayerOneTurn ? 0 : 1],
        playerIndex: wasPlayerOneTurn ? 1 : 2,
        remainingTime: "FirstMove",
      };
      room.players.forEach((player) => {
        player.overtimeTime = PLAYER_OVERTIME;
      });
      room.timerRunning = false;
      room.game.board = generateNewBoard();
      room.game.state = "gameStarted";
      delete room.startNewGameVotes;

      updateRoomAndEmit(io, room);
    }, 400);
  }
}
