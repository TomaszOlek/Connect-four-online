import { generateNewBoard } from "../gameUtils.js"
import { v4 as uuidv4 } from 'uuid';

const PLAYER_OVERTIME = 20

const isUserInLobby = (rooms,socketPlayerId) => {
  for (let i=0; i<rooms.length; i++ ){
    if (rooms[i].players.includes(socketPlayerId)){
      return(rooms[i])
    }
  }
  return false
}

const updateRoomAndEmit = ( io, room ) => {
  io.in(room.lobby).emit("updateRoom", room);
};

export default function checkForFreeGameRoom( socket, io, socketPlayerId, rooms, updateCurrentRoomCallback) {
  if (isUserInLobby(rooms,socketPlayerId)){
    return;
  }
  let currentRoom = null

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].players.length === 1) {
      currentRoom = rooms[i].lobby;
      updateCurrentRoomCallback(currentRoom)

      const newPlayer = {
        playerId: socketPlayerId,
        playerName: `Player${rooms[i].players.length + 1}`,
        overtimeTime: PLAYER_OVERTIME,
      };
      rooms[i].players.push(newPlayer)

      rooms[i].game.state = "gameStarted";
      rooms[i].game.playerTurn = {
        ...rooms[i].players[0],
        playerIndex: 1,
        remainingTime: "FirstMove",
      };

      socket.join(currentRoom);
      updateRoomAndEmit(io, rooms[i]);

      console.log(`Player: ${socketPlayerId}, Joined Room: ${currentRoom}`)
      return;
    }
  }

  currentRoom = uuidv4();
  updateCurrentRoomCallback(currentRoom)
  socket.join(currentRoom);

  const newPlayer = {
    playerId: socketPlayerId,
    playerName: `Player1`,
    overtimeTime : PLAYER_OVERTIME,
  };
  rooms.push({
    lobby: currentRoom,
    game: {
      state: "lookingForPlayers",
      board: generateNewBoard(),
      playerTurn: {
        playerId: "",
        playerName: "",
      },
      score: {
        lastWin: null,
        playerOneWins: 0,
        playerTwoWins: 0,
      }
    },
    players: [newPlayer],
    timerRunning: false,
  });


  const index = rooms.findIndex((room) => room.lobby === currentRoom);
  
  console.log(`Player: ${socketPlayerId}, Created Room: ${currentRoom}`)
  io.in(currentRoom).emit("updateRoom", rooms[index]);

  return currentRoom
};
