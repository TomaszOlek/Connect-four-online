import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import checkForFreeGameRoom from "./socketEvents/checkForFreeGameRoom.js";
import resetGame from "./socketEvents/resetGame.js";
import { handleChipDrop, checkForWin } from "./gameUtils.js"

import { RoomType } from "./types/RoomType"

import { PLAYER_OVERALL_TIME } from "./globalVarables.js"
import { updateRoomAndEmit } from "./functions/globalFunctions"


const PORT = process.env.SERVER_PORT || 3001;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const rooms: Array<RoomType> = [];
// const playersOnline  = [];


io.on("connection", (socket) => {
  let currentRoom: string | null = null;
  const socketPlayerId = socket.id;
  let timer: NodeJS.Timeout;

  const updateCurrentRoomCallback = (updatedCurrentRoom: string) =>{
    currentRoom = updatedCurrentRoom;
  }

  const endGame = (room: RoomType, winner: 1 | 2 | "draw") => {
    clearInterval(timer);
    room.game.state = "gameEnded";
    room.game.score.lastWin = winner;
  };
  
  const startTimer = (room: RoomType) => {
    if (room.timeRunning) {
      return;
    }
    
    room.timeRunning = true;
    timer = setInterval(function(){ 
      if(room.game.playerTurn.remainingTime !== 0 && room.game.playerTurn.remainingTime !== "FirstMove"){
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
      updateRoomAndEmit({ io, room })
    }, 1000);
  }



  socket.on("checkForFreeGameRoom", () =>
    checkForFreeGameRoom({socket, io, socketPlayerId, rooms, updateCurrentRoomCallback})
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
    if (!winerPlayerOrDraw){ // change player if no winder
      room.game.playerTurn = room.game.playerTurn.playerIndex === 1 ?
      {
        ...room.players[1],
        playerIndex: 2,
        remainingTime: PLAYER_OVERALL_TIME
      } : {
        ...room.players[0],
        playerIndex: 1,
        remainingTime: PLAYER_OVERALL_TIME
      }

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

    updateRoomAndEmit({ io, room});
  });

  socket.on("resetGame", (lobby) =>
    resetGame({socket, io, lobby, rooms})
  );

  socket.on("disconnect", () => {
    if (!currentRoom) {
      return;
    }

    const currentRoomIndex = rooms.findIndex(
      (room) => room.lobby === currentRoom
    );

    if (currentRoomIndex !== -1) {
      rooms[currentRoomIndex].players = rooms[currentRoomIndex].players.filter((player) => player.playerId !== socketPlayerId);


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


server.listen({ host: process.env.STAGE === "prod" ? process.env.SERVER_ADRESS : "localhost", port: PORT }, () => {
  console.log(`Server is running on ${process.env.SERVER_ADRESS}:${PORT}`);
});

