import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { PrivateLobbyType } from '../types/PrivateLobbyType';

import { updateRoomAndEmit } from "../functions/globalFunctions"
import { generateNewBoard } from "../gameUtils"
import { PLAYER_OVERTIME } from "../globalVarables"

type lobbyInfoType = {
  lobbyName: string
  lobbyPassword: string
}

export default function createPrivateLobby({ socket, io, privateRooms, lobbyInfo, updateCurrentRoomCallback }: {
  socket: Socket
  io: Server
  privateRooms: Array<PrivateLobbyType>
  lobbyInfo: lobbyInfoType
  updateCurrentRoomCallback: (updatedCurrentRoom: string) => void
}) {
  let currentRoom: string = `Private-${uuidv4()}`;

  if (currentRoom) {
    updateCurrentRoomCallback(currentRoom)
    socket.join(currentRoom);

    const newPlayer = {
      playerId: socket.id,
      playerName: `Player1`,
      overtimeTime: PLAYER_OVERTIME
    };
    const room: PrivateLobbyType = {
      lobby: currentRoom,
      lobbyName: lobbyInfo.lobbyName,
      lobbyPassworld: lobbyInfo.lobbyPassword,
      game: {
        state: "lookingForPlayers",
        board: generateNewBoard(),
        playerTurn: {
          ...newPlayer,
          remainingTime: "FirstMove",
          playerIndex: 1,
        },
        score: {
          lastWin: null,
          playerOneWins: 0,
          playerTwoWins: 0,
        }
      },
      players: [newPlayer],
      timeRunning: false,
    }
    privateRooms.push(room);

    updateRoomAndEmit({ io, room })
    io.emit("updatePrivateLobbys", privateRooms);
  }
}
