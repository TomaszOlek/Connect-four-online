import { Socket, Server } from 'socket.io';
import { RoomType } from "../types/RoomType"
import { updateRoomAndEmit } from '../functions/globalFunctions';

import { PrivateLobbyType } from '../types/PrivateLobbyType';

export default function handleDisconnect({ socket, io, rooms, privateRooms, currentRoom, socketPlayerId, clearTimerCallback }: {
  socket: Socket
  io: Server
  rooms: Array<RoomType>
  privateRooms: Array<PrivateLobbyType>
  currentRoom: string | null
  socketPlayerId: string
  clearTimerCallback: () => void
}) {
  if (!currentRoom || currentRoom.startsWith("Local")) {
    return;
  }
  let room: PrivateLobbyType | RoomType
  let roomIndex: number
  const isRoomPrivet = currentRoom.startsWith("Private")

  if (isRoomPrivet) {
    roomIndex = privateRooms.findIndex(
      (room) => room.lobby === currentRoom
    );

    room = privateRooms[roomIndex]
  } else {
    roomIndex = rooms.findIndex(
      (room) => room.lobby === currentRoom
    );

    room = rooms[roomIndex]
  }


  if (roomIndex !== -1) {
    room.players = room.players.filter((player) => player.playerId !== socketPlayerId);

    if (room.players.length === 1) {
      room.game.state = "oponentLeftLobby"
      socket.leave(room.lobby)
      updateRoomAndEmit({ io, room })
    } else {
      updateRoomAndEmit({ io, removed: room.lobby })
      if (isRoomPrivet) {
        privateRooms.splice(roomIndex, 1);
        io.emit("updatePrivateLobbys", privateRooms);
      } else {
        rooms.splice(roomIndex, 1);
      }
    }
  } else {
    console.log("User was in lobby but the lobby was not found?? (BAD)", currentRoom)
  }
}