import { generateNewBoard } from "../gameUtils"
import { v4 as uuidv4 } from 'uuid';

import { RoomType } from "../types/RoomType"
import { Socket, Server } from 'socket.io';

import { updateRoomAndEmit, isUserInLobby } from "../functions/globalFunctions"
import { PLAYER_OVERTIME } from "../globalVarables"


export default function checkForFreeGameRoom({ socket, io, socketPlayerId, rooms, updateCurrentRoomCallback }: {
  socket: Socket
  io: Server
  socketPlayerId: string
  rooms: Array<RoomType>
  updateCurrentRoomCallback: (updatedCurrentRoom: string) => void
}) {
  if (isUserInLobby({ rooms, socketPlayerId })) {
    return;
  }
  let currentRoom: string | null = null;

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].players.length === 1) {
      let room = rooms[i]

      currentRoom = room.lobby;
      updateCurrentRoomCallback(currentRoom)

      const newPlayer = {
        playerId: socketPlayerId,
        playerName: `Player${room.players.length + 1}`,
        overtimeTime: PLAYER_OVERTIME,
      };
      room.players.push(newPlayer)

      room.game.state = "gameStarted";
      room.game.playerTurn = {
        ...room.players[0],
        playerIndex: 1,
        remainingTime: "FirstMove",
      };

      socket.join(currentRoom);
      updateRoomAndEmit({ io, room })

      console.log(`Player: ${socketPlayerId}, Joined Room: ${currentRoom}`)
      return;
    }
  }

  currentRoom = uuidv4();
  if (currentRoom) {
    updateCurrentRoomCallback(currentRoom)
    socket.join(currentRoom);

    const newPlayer = {
      playerId: socketPlayerId,
      playerName: `Player1`,
      overtimeTime: PLAYER_OVERTIME
    };
    const room: RoomType = {
      lobby: currentRoom,
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
    rooms.push(room);

    updateRoomAndEmit({ io, room })
  }

  console.log(`Player: ${socketPlayerId}, Created Room: ${currentRoom}`)

  return currentRoom
};
