
import { Server } from 'socket.io';
import { RoomType } from "../types/RoomType"



export const updateRoomAndEmit = ({ io, room, removed }: {
  io: Server
  room?: RoomType
  removed?: string
} & ({ room: RoomType } | { removed: string })) => {
  if (removed) {
    io.in(removed).emit("updateRoom", "removed");
  } else {
    io.in(room.lobby).emit("updateRoom", room);
  }
};

export const isUserInLobby = ({ rooms, socketPlayerId }: {
  rooms: Array<RoomType>
  socketPlayerId: string
}) => {
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (room.players.some(player => player.playerId === socketPlayerId)) {
      return room;
    }
  }
  return false;
}