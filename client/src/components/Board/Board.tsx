import styled from "styled-components";
import { Socket } from "socket.io-client";

import PlayerScore from "./PlayerScore";
import WaitingForPlayer from "./WaitingForPlayer";
import PlateRow from "./PlateRow";
import GameInformation from "./GameInformation";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import Logo from "../Utils/Logo";
import { restartRoomData } from "../../actions";

interface BackgroundDecorationProps {
  playerWon: 1 | 2 | 0 | "draw" | false;
}

function Board({ socket }: { socket: Socket }) {
  const room = useSelector((state: RootState) => state.roomData);
  const dispatch = useDispatch();
  const isLocalGame = room.lobby.startsWith("Local");

  const roomState = room.game.state;

  const leaveLobby = () => {
    dispatch(restartRoomData());
    socket.emit("leaveLobby");
  };

  return (
    <Conteiner>
      <LogoContainer onClick={leaveLobby}>
        <Logo />
      </LogoContainer>
      <LobbyTitle>Lobby: {room.lobby}</LobbyTitle>

      <PlayerScore socket={socket} playerIndex={0} isLocalGame={isLocalGame} />
      <Plate>
        {room.game.board.map((row, index) => (
          <PlateRow
            key={index}
            socket={socket}
            index={index}
            row={row}
            isLocalGame={isLocalGame}
          />
        ))}
        {["gameStarted", "gameEnded"].includes(roomState) && (
          <GameInformation socket={socket} />
        )}
      </Plate>
      <PlayerScore socket={socket} playerIndex={1} isLocalGame={isLocalGame} />
      {["lookingForPlayers", "oponentLeftLobby"].includes(roomState) && (
        <WaitingForPlayer socket={socket} />
      )}
      <BackgroundDecoration
        playerWon={roomState === "gameEnded" && room.game.score.lastWin}
      />
    </Conteiner>
  );
}

export default Board;

const LogoContainer = styled.div`
  position: absolute;
  top: 30px;
`;
const Conteiner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  isolation: isolate;
`;
const BackgroundDecoration = styled.div<BackgroundDecorationProps>`
  content: "";
  width: 100vw;
  height: 80px;

  position: absolute;
  bottom: 0px;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background: #5c2dd5;
  ${(props) =>
    (props.playerWon === 1 &&
      `
      background-color: #eb607e;
    `) ||
    (props.playerWon === 2 &&
      `
      background-color: #ffcf68;
    `)}

  z-index: 0;
`;
const Plate = styled.div`
  width: 490px;
  height: 480px;
  padding-top: 20px;
  margin-bottom: 50px;
  box-sizing: border-box;

  box-shadow: 1px 5px 1px;
  background-color: white;
  border: 4px solid black;
  border-radius: 30px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  z-index: 1;
`;
const LobbyTitle = styled.p`
  position: absolute;
  left: 5px;
  bottom: 2px;

  color: white;
  font-size: 12px;
  z-index: 1;
`;
