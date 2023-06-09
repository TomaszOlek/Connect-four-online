
import { Server } from 'socket.io';

import { handleChipDrop, checkForWin } from "../gameUtils"

import { PLAYER_OVERALL_TIME } from "../globalVarables"
import { updateRoomAndEmit } from "../functions/globalFunctions"

import { RoomType } from "../types/RoomType"
import { PrivateLobbyType } from '../types/PrivateLobbyType';

const handelPoints = ({ winerPlayerOrDraw, room }) => {
  if (winerPlayerOrDraw === 1) {
    ++room.game.score.playerOneWins
  } else if (winerPlayerOrDraw === 2) {
    ++room.game.score.playerTwoWins
  } else {
    ++room.game.score.playerOneWins
    ++room.game.score.playerTwoWins
  }
}

const startTimer = ({ io, room, updateTimerCallback, clearTimerCallback }: {
  io: Server
  room: RoomType
  updateTimerCallback: (updatedTimer: NodeJS.Timeout) => void
  clearTimerCallback: () => void
}) => {
  if (room.timeRunning) {
    return;
  }

  room.timeRunning = true;
  updateTimerCallback(setInterval(function () {
    if (room.game.playerTurn.remainingTime !== 0 && room.game.playerTurn.remainingTime !== "FirstMove") {
      room.game.playerTurn.remainingTime--
    } else {
      room.players[room.game.playerTurn.playerIndex - 1].overtimeTime--
      if (room.players[room.game.playerTurn.playerIndex - 1].overtimeTime === 0) {
        const winner = room.game.playerTurn.playerIndex === 1 ? 2 : 1
        room.game.state = "gameEnded";
        room.game.score.lastWin = winner;
        handelPoints({ winerPlayerOrDraw: winner, room })
        clearTimerCallback();
      }
    }

    if (room.game.state === "oponentLeftLobby") {
      clearTimerCallback();
    }

    updateRoomAndEmit({ io, room })
  }, 1000));
}



export default function playerMove({ io, rooms, privateRooms, playerMoveData, updateTimerCallback, clearTimerCallback }: {
  io: Server
  rooms: Array<RoomType>
  privateRooms: Array<PrivateLobbyType>
  playerMoveData: PlayerMoveType
  updateTimerCallback: (updatedTimer: NodeJS.Timeout) => void
  clearTimerCallback: () => void
}) {

  let room: PrivateLobbyType | RoomType
  let roomIndex: number
  const currentRoom = playerMoveData.playerLobby

  if (currentRoom.startsWith("Private")) {
    room = privateRooms.find((room) => room.lobby === currentRoom);

  } else {
    room = rooms.find((room) => room.lobby === currentRoom);
  }



  let board = room.game.board
  //isMoveValid
  const selectedRow = board[playerMoveData.rowSelected]
  if (!selectedRow.includes(0) || room.game.state !== "gameStarted") {
    return;
  }


  console.log(`Player: ${playerMoveData.playerId} Selected: ${playerMoveData.rowSelected} row`)
  board = handleChipDrop(board, room, selectedRow, playerMoveData.rowSelected)
  room.game.board = board

  const winerPlayerOrDraw = checkForWin(board)
  if (!winerPlayerOrDraw) { // change player if no winder
    room.game.playerTurn = room.game.playerTurn.playerIndex === 1 ?
      {
        ...room.players[1],
        playerIndex: 2,
        remainingTime: PLAYER_OVERALL_TIME
      } : {
        ...room.players[0],
        playerIndex: 1,
        remainingTime: PLAYER_OVERALL_TIME
      }

    startTimer({ io, room, updateTimerCallback, clearTimerCallback });
  } else {
    clearTimerCallback()
    room.game.state = "gameEnded"
    room.game.score.lastWin = winerPlayerOrDraw
    handelPoints({ winerPlayerOrDraw, room })
  }

  updateRoomAndEmit({ io, room });
}

type PlayerMoveType = {
  rowSelected: number,
  playerId: string,
  playerLobby: string,
}