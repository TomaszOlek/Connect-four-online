
import { Server } from 'socket.io';
import { RoomType } from "../types/RoomType"

export const updateRoomAndEmit = ({io, room}: {
  io: Server
  room: RoomType
}) => {
  io.in(room.lobby).emit("updateRoom", room);
};

export const isUserInLobby = ({rooms,socketPlayerId} : {
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