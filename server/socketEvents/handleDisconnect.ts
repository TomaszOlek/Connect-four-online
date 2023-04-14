
import { Server } from 'socket.io';
import { RoomType } from "../types/RoomType"
import { updateRoomAndEmit } from '../functions/globalFunctions';

export default function handleDisconnect({io, rooms, currentRoom, socketPlayerId, clearTimerCallback}: {
  io: Server
  rooms: Array<RoomType>
  currentRoom: string | null
  socketPlayerId: string
  clearTimerCallback: () => void
}) {
  if (!currentRoom) {
    return;
  }

  const currentRoomIndex = rooms.findIndex(
    (room) => room.lobby === currentRoom
  );

  const room = rooms[currentRoomIndex]

  if (currentRoomIndex !== -1) {
    room.players = room.players.filter((player) => player.playerId !== socketPlayerId);

    if (room.players.length === 1) {
      room.game.state = "oponentLeftLobby"
      updateRoomAndEmit({io, room})
    } else {
      updateRoomAndEmit({io, removed:room.lobby})
      rooms.splice(currentRoomIndex, 1);
    }
  } else{
    console.log("User was in lobby but the lobby was not found?? (BAD)")
  }
}