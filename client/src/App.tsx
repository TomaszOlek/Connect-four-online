import { useEffect } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import MainMenu from "./components/MainMenu";
import Board from "./components/Board/Board";
import Rules from "./components/Rules";
import LobbyContainer from "./components/LobbyList/LobbyContainer";
import BotDifficultySelection from "./components/BotComponents/BotDifficultySelection";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./reducers";
import {
  updateRoomData,
  updatePrivateRoomData,
  updateShowRules,
  updateShowLobbys,
  updateShowBotDifficult,
} from "./actions";
import { initialState } from "./reducers/roomData";

function App({ socket }: { socket: Socket }) {
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.roomData);
  const isShowRules = useSelector((state: RootState) => state.showRules);
  const isShowLobbys = useSelector((state: RootState) => state.showLobbys);
  const isShowBotDifficulty = useSelector(
    (state: RootState) => state.showBotDifficulty
  );

  useEffect(() => {
    const handleBackButton = (event: Event) => {
      // prevent the default behavior of the back button
      event.preventDefault();
      //leave the lobby and update the room
      dispatch(updateRoomData(initialState));
      socket.emit("leaveLobby");
    };

    socket.on("updateRoom", (roomData) => {
      if (roomData === "removed") {
        dispatch(updateRoomData(initialState));
        closeAllMenu();
      } else {
        if (roomData.lobby !== "") {
          window.history.pushState({ roomData }, "");
          // add the event listener for the back button
          window.addEventListener("popstate", handleBackButton);
        } else {
          // remove the history state when we are not in lobby
          window.history.back();
          // remove the event listener for the back button
          window.removeEventListener("popstate", handleBackButton);
        }
        dispatch(updateRoomData(roomData));
        closeAllMenu();
      }
    });

    socket.on("updatePrivateLobbys", (roomsData) => {
      dispatch(updatePrivateRoomData(roomsData));
    });

    return () => {
      socket.off("updateRoom");
      socket.off("updatePrivateLobbys");
    };
  }, [socket]);

  const closeAllMenu = () => {
    dispatch(updateShowRules(false));
    dispatch(updateShowLobbys(false));
    dispatch(updateShowBotDifficult(false));
  };

  const renderMenu = () => {
    if (room.lobby === "" || !room.lobby) {
      return <MainMenu socket={socket} />;
    }
    return <Board socket={socket} />;
  };

  return (
    <Conteiner>
      {renderMenu()}
      {isShowRules && <Rules />}
      {isShowLobbys && <LobbyContainer socket={socket} />}
      {isShowBotDifficulty && <BotDifficultySelection />}
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
