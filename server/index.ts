import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv'

import playerMove from "./socketEvents/playerMove";
import checkForFreeGameRoom from "./socketEvents/checkForFreeGameRoom";
import resetGame from "./socketEvents/resetGame";
import handleDisconnect from "./socketEvents/handleDisconnect"
import createPrivateLobby from "./socketEvents/createPrivateLobby"
import joinPrivateLobby from "./socketEvents/joinPrivateLobby"

import { RoomType } from "./types/RoomType"
import { PrivateLobbyType } from "./types/PrivateLobbyType"


const PORT = process.env.SERVER_PORT || 3001;
const app = express();
app.use(cors());
dotenv.config()

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const rooms: Array<RoomType> = [];
const privateRooms: Array<PrivateLobbyType> = [];

const playersOnline = [];

io.on("connection", (socket) => {
  io.emit("updatePrivateLobbys", privateRooms);

  let currentRoom: string | null = null;
  const socketPlayerId = socket.id;
  let timer: NodeJS.Timeout;

  const updateCurrentRoomCallback = (updatedCurrentRoom: string) => {
    currentRoom = updatedCurrentRoom;
  }
  const updateTimerCallback = (updatedTimer: NodeJS.Timeout) => {
    timer = updatedTimer;
  }
  const clearTimerCallback = () => {
    clearInterval(timer);
  }


  socket.on("checkForFreeGameRoom", () =>
    checkForFreeGameRoom({ socket, io, rooms, socketPlayerId, updateCurrentRoomCallback })
  );
  socket.on("playerMove", (playerMoveData) =>
    playerMove({ io, rooms, privateRooms, playerMoveData, updateTimerCallback, clearTimerCallback })
  );
  socket.on("resetGame", (lobby) =>
    resetGame({ socket, io, rooms, privateRooms, lobby })
  );
  socket.on("createPrivateLobby", (lobbyInfo) => {
    createPrivateLobby({ socket, io, privateRooms, lobbyInfo, updateCurrentRoomCallback })
  })
  socket.on("joinPrivateLobby", (lobbyInfo) => {
    joinPrivateLobby({ socket, io, privateRooms, lobbyInfo, updateCurrentRoomCallback })
  })

  socket.on("leaveLobby", () => {
    handleDisconnect({ io, rooms, privateRooms, currentRoom, socketPlayerId, clearTimerCallback })
  })
  socket.on("disconnect", () =>
    handleDisconnect({ io, rooms, privateRooms, currentRoom, socketPlayerId, clearTimerCallback })
  );
});


server.listen({ host: process.env.STAGE === "prod" ? process.env.SERVER_ADRESS : "localhost", port: PORT }, () => {
  console.log(`Server is running on ${process.env.STAGE === "prod" ? process.env.SERVER_ADRESS : "localhost"}:${PORT}`);
});
