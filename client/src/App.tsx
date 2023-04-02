import "./App.css";
import { useEffect } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./reducers";
import { updateRoomData } from "./actions";
// connect-four.io

function App({ socket }: { socket: Socket }) {
  const dispatch = useDispatch();

  const room = useSelector((state: RootState) => state.roomData);

  useEffect(() => {
    socket.on("updateRoom", (roomData) => {
      dispatch(updateRoomData(roomData));
    });

    return () => {
      socket.off("updateRoom");
    };
  }, [socket]);

  return (
    <Conteiner>
      {room.lobby === "" ? (
        <MainMenu socket={socket} />
      ) : (
        <Board socket={socket} />
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
