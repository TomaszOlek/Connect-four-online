import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
// connect-four.io

function App({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState();
  console.log(socket);

  const handelEndGame = () => {
    socket.emit("endGame", room);
  };

  useEffect(() => {
    socket.on("roomCreated", (roomData) => {
      setRoom(roomData);
    });

    socket.on("roomJoined", (roomData) => {
      setRoom(roomData);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
    };
  }, [socket]);

  return (
    <Conteiner>
      {!room ? (
        <MainMenu socket={socket} />
      ) : (
        <Board room={room} socket={socket} />
      )}
    </Conteiner>
  );
}

export default App;

const Conteiner = styled.div`
  width: 100%;
  height: 100%;
  background-color: #7a45ff;
`;
