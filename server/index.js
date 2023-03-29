import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid';

import { generateNewBoard } from "./gameUtils.js"
import { handelChipDrop } from "./gameUtils.js"
import { checkForWin } from "./gameUtils.js"

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
})

const rooms = [];

io.on("connection", (socket) => {
  let currentRoom = null;
  const socketPlayerId = socket.id

  const isUserInLobby = () =>{
    for (let i=0; i<rooms.length; i++ ){
      if (rooms[i].players.includes(socketPlayerId)){
        return(rooms[i])
      }
    }
    return false
  }

  const joinOrCreateRoom = () => {
    if (isUserInLobby()){
      return;
    }

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].players.length === 1) {
        currentRoom = rooms[i].lobby;

        rooms[i].players = [  ...rooms[i].players,
          {
            playerId: socket.id,
            playerName: `Player${rooms[i].players.length+1}`,
          }
        ];
        rooms[i].game.state = "gameStarted";
        rooms[i].game.playerTurn = {
          ...rooms[i].players[0],
          playerIndex: 1,
        };

        socket.join(currentRoom);
        socket.broadcast.emit("updateRoom", rooms[i]);
        socket.emit("updateRoom", rooms[i]);

        console.log(`Player: ${socketPlayerId}, Joined Room: ${currentRoom}`)
        return;
      }
    }

    currentRoom = uuidv4();
    rooms.push({
      lobby: currentRoom,
      game: {
        state: "lookingForPlayers",
        board: generateNewBoard(),
        playerTurn: {
          playerId: "",
          playerName: "",
          playerIndex: 1,
        },
      },
      players: [
        {
          playerId: socketPlayerId,
          playerName: "Player1",
        }
      ]
    });

    const index = rooms.findIndex((room) => room.lobby === currentRoom);

    console.log(`Player: ${socketPlayerId}, Created Room: ${currentRoom}`)
    socket.emit("updateRoom", rooms[index])
  };


  socket.on("checkForFreeGameRoom", () => {
    joinOrCreateRoom();
  });


  socket.on("playerMove", (playerMoveData) => {
    const roomIndex = rooms.findIndex((room) => room.lobby === playerMoveData.playerLobby);
    const currentRoom = rooms[roomIndex]
    let board = currentRoom.game.board
    //isMoveValid
    const selectedRow = board[playerMoveData.rowSelected]
    if(!selectedRow.includes(null)){
      return; 
    }
    console.log(`Player: ${playerMoveData.playerId} Selected: ${playerMoveData.rowSelected} row`)

    board = handelChipDrop(board, currentRoom, selectedRow, playerMoveData.rowSelected)

    checkForWin(board)

    currentRoom.game.board = board
    // if (win){

    // }else{

      currentRoom.game.playerTurn = currentRoom.game.playerTurn.playerIndex === 1 ?
      {
        ...currentRoom.players[1],
        playerIndex: 2
      } : {
        ...currentRoom.players[0],
        playerIndex: 1
      }
    // }
 

    socket.broadcast.emit("updateRoom", currentRoom);
    socket.emit("updateRoom", currentRoom);
  });


  socket.on("disconnect", () => {
    if (!currentRoom) {
      return;
    }

    const currentRoomIndex = rooms.findIndex((room) => room.lobby === currentRoom);
    if (currentRoomIndex !== -1) {
      rooms[currentRoomIndex].players = rooms[currentRoomIndex].players.filter(
        (player) => player !== socket.id
      );
      if (rooms[currentRoomIndex].players.length === 0) {
        rooms.splice(currentRoomIndex, 1);
      } else if (rooms[currentRoomIndex].players.length === 1) {
        // io.to(currentRoom).emit("waitOpponent");
      }
    }
  });
});

server.listen(3001, () => {
  console.log("server is running")
})