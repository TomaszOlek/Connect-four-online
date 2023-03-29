import styled from "styled-components";
import { Socket } from "socket.io-client";

import PlayerScore from "./PlayerScore";
import WaitingForPlayer from "./WaitingForPlayer";
import PlateRow from "./PlateRow";
import GameInforamtionContainer from "./GameInforamtionContainer";

import yellowMarker from "../assets/marker-yellow.svg";
import redMarker from "../assets/marker-red.svg";
import test from "../assets/test.svg";

function Board({ socket, room }: { socket: Socket; room: any }) {
  console.log(room.game.state);
  return (
    <Conteiner>
      <LobbyTitle>Lobby: {room.lobby}</LobbyTitle>

      <PlayerScore socket={socket} players={room.players} playerIndex={0} />
      <Plate>
        {room.game.board.map((row, index) => (
          <PlateRow
            key={index}
            room={room}
            socket={socket}
            index={index}
            row={row}
          />
        ))}
        {(room.game.state === "gameStarted" ||
          room.game.state === "gameEnded") && (
          <GameInforamtionContainer gameInfo={room.game} />
        )}
      </Plate>
      <PlayerScore socket={socket} players={room.players} playerIndex={1} />
      {room.game.state === "lookingForPlayers" && <WaitingForPlayer />}
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
`;
const LobbyTitle = styled.p`
  position: absolute;
  left: 5px;
  bottom: 2px;

  color: white;
  font-size: 12px;
`;
