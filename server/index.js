import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid';

import { generateNewBoard } from "./gameUtils.js"
import { handelChipDrop } from "./gameUtils.js"
import { checkForWin } from "./gameUtils.js"

// in Seconds
const PLAYER_OVERTIME = 20
const PLAYER_OVERALL_TIME = 15

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

io.on("connection", ( socket ) => {
  let currentRoom = null;
  const socketPlayerId = socket.id

  const updateRoomAndEmit = ( room ) => {
    io.in(room.lobby).emit("updateRoom", room);
  };

  const isUserInLobby = () => {
    for (let i=0; i<rooms.length; i++ ){
      if (rooms[i].players.includes(socketPlayerId)){
        return(rooms[i])
      }
    }
    return false
  }

  const startTimer = (room) => {
    console.log(room)
    setInterval(function(){ 
      if(room.game.playerTurn.remainingTime !== 0){
        room.game.playerTurn.remainingTime--
      } else{
        room.players[room.game.playerTurn.playerIndex-1].overtimeTime--
      } 
      updateRoomAndEmit(room)
    }, 1000);
  }


  const joinOrCreateRoom = () => {
    if (isUserInLobby()){
      return;
    }

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].players.length === 1) {
        currentRoom = rooms[i].lobby;

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
        updateRoomAndEmit(rooms[i]);

        console.log(`Player: ${socketPlayerId}, Joined Room: ${currentRoom}`)
        return;
      }
    }

    currentRoom = uuidv4();
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
      },
      players: [newPlayer]
    });


    const index = rooms.findIndex((room) => room.lobby === currentRoom);
    
    console.log(`Player: ${socketPlayerId}, Created Room: ${currentRoom}`)
    io.in(currentRoom).emit("updateRoom", rooms[index]);
  };


  socket.on("checkForFreeGameRoom", () => {
    joinOrCreateRoom();
  });


  socket.on("playerMove", (playerMoveData) => {
    const roomIndex = rooms.findIndex((room) => room.lobby === playerMoveData.playerLobby);
    const room = rooms[roomIndex]
    let board = room.game.board
    //isMoveValid
    const selectedRow = board[playerMoveData.rowSelected]
    if(!selectedRow.includes(null)){
      return; 
    }
    console.log(`Player: ${playerMoveData.playerId} Selected: ${playerMoveData.rowSelected} row`)
    board = handelChipDrop(board, room, selectedRow, playerMoveData.rowSelected)


    checkForWin(board)

    room.game.board = board
    // if (win){

    // }else{
      room.game.playerTurn = room.game.playerTurn.playerIndex === 1 ?
      {
        ...room.players[1],
        playerIndex: 2
      } : {
        ...room.players[0],
        playerIndex: 1
      }
      room.game.playerTurn.remainingTime = PLAYER_OVERALL_TIME
      startTimer(room);
    // }

    updateRoomAndEmit(room);
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