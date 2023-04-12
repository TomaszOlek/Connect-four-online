import { generateNewBoard } from "../gameUtils.js"

import { RoomType } from "../types/RoomType"
import { Socket, Server } from 'socket.io';

import { PLAYER_OVERTIME } from "../globalVarables"
import { updateRoomAndEmit } from "../functions/globalFunctions"


function isEven(value: number) {
  return value % 2 === 0;
}

export default function resetGame({socket, io, lobby, rooms}: {
  socket: Socket
  io: Server
  lobby: string
  rooms: Array<RoomType>
}) {
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
    updateRoomAndEmit({io, room});
  } else if (room.startNewGameVotes.playersVoted.includes(socket.id)) {
    console.log(`The player ${socket.id} already voted to start a new game.`);
    return;
  } else {
    room.startNewGameVotes.votes++;
    room.startNewGameVotes.playersVoted.push(socket.id);
    updateRoomAndEmit({io, room});
  }

  console.log(`Votes to start new game: ${room.startNewGameVotes.votes}/${room.players.length}`);

  if (room.startNewGameVotes.votes === room.players.length) {
    setTimeout(() => {
      const wasPlayerOneTurn = isEven(room.game.score.playerOneWins + room.game.score.playerTwoWins);
      console.log(`Player ${room.players[0].playerId} is ${wasPlayerOneTurn ? "now" : "still"} player one.`);

      room.game.playerTurn = {
        ...room.players[wasPlayerOneTurn ? 0 : 1],
        playerIndex: wasPlayerOneTurn ? 1 : 2,
        remainingTime: "FirstMove",
      };
      room.players.forEach((player) => {
        player.overtimeTime = PLAYER_OVERTIME;
      });
      room.timeRunning = false;
      room.game.board = generateNewBoard();
      room.game.state = "gameStarted";
      delete room.startNewGameVotes;

      updateRoomAndEmit({io, room});
    }, 400);
  }
}
