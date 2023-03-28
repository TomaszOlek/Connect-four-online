import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

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
  const playerId = socket.id

  const isUserInLobby = () =>{
    for (let i=0; i<rooms.length; i++ ){
      if (rooms[i].players.includes(playerId)){
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
        currentRoom = rooms[i].lobbyName;
        rooms[i].players.push(socket.id);
        socket.join(currentRoom);
        console.log(`Player: ${socket.id}, Joined Room: ${currentRoom}`)
        
        socket.broadcast.emit("roomJoined", rooms[i]);
        socket.emit("roomJoined", rooms[i]);
        return;
      }
    }

    currentRoom = `gameRoom${rooms.length + 1}`;
    rooms.push({
      lobbyName: currentRoom,
      players: [socket.id],
    });

    // players: {
    //   player1: {
        
    //   },
    //   player2: {

    //   }
    // },

    const index = rooms.findIndex((room) => room.lobbyName === currentRoom);

    console.log(`Player: ${socket.id}, Created Room: ${currentRoom}`)
    socket.emit("roomCreated", rooms[index])
  };

  socket.on("checkForFreeGameRoom", () => {
    joinOrCreateRoom();
  });

  socket.on("disconnect", () => {
    if (!currentRoom) {
      return;
    }

    const roomIndex = rooms.findIndex((room) => room.lobbyName === currentRoom);
    if (roomIndex !== -1) {
      rooms[roomIndex].players = rooms[roomIndex].players.filter(
        (player) => player !== socket.id
      );
      if (rooms[roomIndex].players.length === 0) {
        rooms.splice(roomIndex, 1);
      } else if (rooms[roomIndex].players.length === 1) {
        io.to(currentRoom).emit("waitOpponent");
      }
    }
  });
});

server.listen(3001, () => {
  console.log("server is running")
})