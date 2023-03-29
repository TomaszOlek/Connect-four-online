import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
// connect-four.io

function App({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState();
  console.log("room", room);

  const handelEndGame = () => {
    socket.emit("endGame", room);
  };

  useEffect(() => {
    //   socket.on("roomCreated", (roomData) => {
    //     setRoom(roomData);
    //   });

    //   socket.on("roomJoined", (roomData) => {
    //     setRoom(roomData);
    //   });

    socket.on("updateRoom", (roomData) => {
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
      <Version>Version: {import.meta.env.VITE_APP_VERSION}</Version>
    </Conteiner>
  );
}

export default App;

const Conteiner = styled.div`
  width: 100%;
  height: 100%;
  background-color: #7a45ff;
`;

const Version = styled.p`
  position: absolute;
  right: 5px;
  bottom: 2px;

  color: white;
  font-size: 12px;
`;
