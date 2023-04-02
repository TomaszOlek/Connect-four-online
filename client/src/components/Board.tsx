import styled from "styled-components";
import { Socket } from "socket.io-client";

import PlayerScore from "./PlayerScore";
import WaitingForPlayer from "./WaitingForPlayer";
import PlateRow from "./PlateRow";
import GameInforamtionContainer from "./GameInforamtionContainer";

import { useSelector } from "react-redux";
import { RootState } from "../reducers";

interface BackgroundDecorationProps {
  playerWon: 1 | 2 | null | false;
}

function Board({ socket }: { socket: Socket }) {
  const room = useSelector((state: RootState) => state.roomData);
  return (
    <Conteiner>
      <LobbyTitle>Lobby: {room.lobby}</LobbyTitle>

      <PlayerScore socket={socket} playerIndex={0} />
      <Plate>
        {room.game.board.map((row, index) => (
          <PlateRow key={index} socket={socket} index={index} row={row} />
        ))}
        {(room.game.state === "gameStarted" ||
          room.game.state === "gameEnded") && <GameInforamtionContainer />}
      </Plate>
      <PlayerScore socket={socket} playerIndex={1} />
      {room.game.state === "lookingForPlayers" && <WaitingForPlayer />}
      <BackgroundDecoration
        playerWon={room.game.state === "gameEnded" && room.game.score.lastWin}
      />
    </Conteiner>
  );
}

export default Board;

const Conteiner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  isolation: isolate;
`;
const BackgroundDecoration = styled.p<BackgroundDecorationProps>`
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
      background-color: #eb607e;
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
