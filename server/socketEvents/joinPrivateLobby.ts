import { Socket, Server } from 'socket.io';

import { PrivateLobbyType } from '../types/PrivateLobbyType';

import { updateRoomAndEmit } from "../functions/globalFunctions"
import { PLAYER_OVERTIME } from "../globalVarables"

export default function joinPrivateLobby({ socket, io, privateRooms, lobbyInfo, updateCurrentRoomCallback }: {
  socket: Socket
  io: Server
  privateRooms: Array<PrivateLobbyType>
  lobbyInfo: string
  updateCurrentRoomCallback: (updatedCurrentRoom: string) => void
}) {

  const currentRoomIndex = privateRooms.findIndex(
    (room) => room.lobby === lobbyInfo
  );

  if (privateRooms[currentRoomIndex].players.length === 1) {
    let room = privateRooms[currentRoomIndex]

    const currentRoom = room.lobby;
    updateCurrentRoomCallback(currentRoom)

    const newPlayer = {
      playerId: socket.id,
      playerName: `Player${room.players.length + 1}`,
      overtimeTime: PLAYER_OVERTIME,
    };
    room.players.push(newPlayer)

    room.game.state = "gameStarted";

    socket.join(currentRoom);
    updateRoomAndEmit({ io, room })

    console.log(`Player: ${socket.id}, Joined Room: ${currentRoom}`)
    return;
  } else {
    console.log("lobby is full")
  }

}
