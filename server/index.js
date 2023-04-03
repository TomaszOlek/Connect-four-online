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

function isEven(value){
  if (value%2 == 0)
      return true;
  else
      return false;
}

io.on("connection", ( socket ) => {
  let currentRoom = null;
  const socketPlayerId = socket.id
  var timer

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
    if(!selectedRow.includes(null) || room.game.state !== "gameStarted"){
      return; 
    }

    console.log(`Player: ${playerMoveData.playerId} Selected: ${playerMoveData.rowSelected} row`)
    board = handelChipDrop(board, room, selectedRow, playerMoveData.rowSelected)
    room.game.board = board

    const winerPlayer = checkForWin(board)

    if (winerPlayer){
      endGame(room, winerPlayer)
      console.log(winerPlayer)
      if (winerPlayer === 1){
        ++room.game.score.playerOneWins
      }else{
        ++room.game.score.playerTwoWins
      }
    }else{
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
    }

    updateRoomAndEmit(room);
  });


  socket.on("ResetGame", (lobby) => {
    const roomIndex = rooms.findIndex((room) => room.lobby === lobby);
    const room = rooms[roomIndex]
    console.log(`Player ${socket.id} Voted to start new game.`)
    if(!room.startNewGameVotes){
      room.startNewGameVotes = {
        votes: 1,
        playersVoted: [socket.id]
      }
      updateRoomAndEmit(room)
    }
    if(room.startNewGameVotes.playersVoted.includes(socket.id)){
      return
    }
    room.startNewGameVotes.votes++
    room.startNewGameVotes.playersVoted.push(socket.id)
    updateRoomAndEmit(room)

    setTimeout(()=>{
      const wasPlayerOneTourn = isEven(room.game.score.playerOneWins + room.game.score.playerTwoWins)

      console.log(wasPlayerOneTourn)

      room.game.playerTurn = {
        ...room.players[wasPlayerOneTourn ? 0 : 1 ],
        playerIndex: wasPlayerOneTourn ? 1 : 2,
        remainingTime: "FirstMove",
      };
      room.players.map((player)=>{
        player.overtimeTime = PLAYER_OVERTIME
      })
      room.timerRunning = false

      room.game.board = generateNewBoard()
      room.game.state = "gameStarted"
      delete room.startNewGameVotes
      updateRoomAndEmit(room)
    }, 400);  
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