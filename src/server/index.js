import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import checkForFreeGameRoom from "./socketEvents/checkForFreeGameRoom.js";
import resetGame from "./socketEvents/resetGame.js";
import { handleChipDrop, checkForWin } from "./gameUtils.js"

const PLAYER_OVERALL_TIME = 15

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = [];
const playersOnline = [];

io.on("connection", (socket) => {
  console.log("123")
  let currentRoom = null;
  const socketPlayerId = socket.id;
  let timer

  const updateCurrentRoom = (newCurrentRoom) =>{
    currentRoom = newCurrentRoom;
  }

  const updateRoomAndEmit = ( room ) => {
    io.in(room.lobby).emit("updateRoom", room);
  };

  const endGame = (room, winner) => {
    clearInterval(timer);
    room.game.state = "gameEnded"
    room.game.score.lastWin = winner
  }

  const startTimer = (room) => {
    if (room.timerRunning) {
      return;
    }
    room.timerRunning = true;
    timer = setInterval(function(){ 
      if(room.game.playerTurn.remainingTime !== 0){
        room.game.playerTurn.remainingTime--
      } else{
        room.players[room.game.playerTurn.playerIndex-1].overtimeTime--
        if (room.players[room.game.playerTurn.playerIndex-1].overtimeTime === 0){
          endGame(room, room.game.playerTurn.playerIndex === 1 ? 2 : 1)
        }
      } 
      const winerPlayerOrDraw = checkForWin(room.game.board)
      if (winerPlayerOrDraw === "draw"){
        endGame(room, "draw")
      } else if(room.game.state === "oponentLeftLobby"){
        clearInterval(timer);
      }
      updateRoomAndEmit(room)
    }, 1000);
  }


  socket.on("checkForFreeGameRoom", () =>
    checkForFreeGameRoom(socket, io, socketPlayerId, rooms, updateCurrentRoom)
  );
  socket.on("playerMove", (playerMoveData) => {
    const roomIndex = rooms.findIndex((room) => room.lobby === playerMoveData.playerLobby);
    const room = rooms[roomIndex]
    let board = room.game.board
    //isMoveValid
    const selectedRow = board[playerMoveData.rowSelected]
    if(!selectedRow.includes(null) || room.game.state !== "gameStarted"){
      return; 
    }

    console.log(`Player: ${playerMoveData.playerId} Selected: ${playerMoveData.rowSelected} row`)
    board = handleChipDrop(board, room, selectedRow, playerMoveData.rowSelected)
    room.game.board = board

    const winerPlayerOrDraw = checkForWin(board)
    if (!winerPlayerOrDraw){ // change player adn no winder
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
    }else{
      clearInterval(timer);
      room.game.state = "gameEnded"
      room.game.score.lastWin = winerPlayerOrDraw
      if (winerPlayerOrDraw === 1){
        ++room.game.score.playerOneWins
      }else if(winerPlayerOrDraw === 2){
        ++room.game.score.playerTwoWins
      }else{
        ++room.game.score.playerOneWins
        ++room.game.score.playerTwoWins
      }
    }

    updateRoomAndEmit(room);
  });

  socket.on("resetGame", (lobby) =>
    resetGame(socket, io, lobby, rooms)
  );

  socket.on("disconnect", () => {
    if (!currentRoom) {
      return;
    }

    const currentRoomIndex = rooms.findIndex(
      (room) => room.lobby === currentRoom
    );

    if (currentRoomIndex !== -1) {
      rooms[currentRoomIndex].players = rooms[
        currentRoomIndex
      ].players.filter((player) => player !== socket.id);

      console.log(rooms[currentRoomIndex].players.length)

      if (rooms[currentRoomIndex].players.length === 1) {
        rooms.splice(currentRoomIndex, 1);
      } else {
        rooms[currentRoomIndex].game.state = "oponentLeftLobby"
        io.in(currentRoom).emit("updateRoom", rooms[currentRoomIndex]);
      }

    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
