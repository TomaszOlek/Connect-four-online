
import { Server } from 'socket.io';
import { RoomType } from "../types/RoomType"

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

  if (currentRoomIndex !== -1) {
    rooms[currentRoomIndex].players = rooms[currentRoomIndex].players.filter((player) => player.playerId !== socketPlayerId);

    if (rooms[currentRoomIndex].players.length === 1) {
      rooms[currentRoomIndex].game.state = "oponentLeftLobby"
      io.in(currentRoom).emit("updateRoom", rooms[currentRoomIndex]);
    } else {
      rooms.splice(currentRoomIndex, 1);
    }
  } else{
    console.log("User was in lobby but the lobby was not found?? (BAD)")
  }
}