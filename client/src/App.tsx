import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
// connect-four.io

function App({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState();
  console.log(room);

  const handelEndGame = () => {
    socket.emit("endGame", room);
  };

  useEffect(() => {
    socket.on("roomCreated", (roomData) => {
      setRoom(roomData);
    });

    socket.on("roomJoined", (roomName) => {
      setRoom(roomName);
    });
  }, [socket]);

  return (
    <Conteiner>
      {!room ? (
        <MainMenu socket={socket} />
      ) : (
        <Board room={room} socket={socket} />
      )}
      {/* <button onClick={handelJoinRoom}>Join Room</button>
      <h1>Current Room: {room?.name}</h1>
      {room?.players?.map((item) => (
        <p>{item}</p>
      ))}
      <button onClick={handelEndGame}>End Game</button> */}
    </Conteiner>
  );
}

export default App;

const Conteiner = styled.div`
  width: 100%;
  height: 100%;
  background-color: #7a45ff;
`;
