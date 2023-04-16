import { useEffect } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
import Rules from "./components/Rules";
import LobbyContainer from "./components/LobbyList/LobbyContainer";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./reducers";
import { updateRoomData } from "./actions";
import { initialState } from "./reducers/roomData";

function App({ socket }: { socket: Socket }) {
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.roomData);
  const isShowRules = useSelector((state: RootState) => state.showRules);
  const isShowLobbys = useSelector((state: RootState) => state.showLobbys);

  useEffect(() => {
    socket.on("updateRoom", (roomData) => {
      console.log(roomData);
      if (roomData === "removed") {
        dispatch(updateRoomData(initialState));
      }
      dispatch(updateRoomData(roomData));
    });

    return () => {
      socket.off("updateRoom");
    };
  }, [socket]);

  return (
    <Conteiner>
      {room.lobby === "" || !room.lobby ? (
        <MainMenu socket={socket} />
      ) : (
        <Board socket={socket} />
      )}
      {isShowRules && <Rules />}
      {isShowLobbys && <LobbyContainer socket={socket} />}
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
