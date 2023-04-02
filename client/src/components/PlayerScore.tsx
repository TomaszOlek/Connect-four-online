import styled from "styled-components";
import { Socket } from "socket.io-client";

import playerOne from "../assets/player-one.svg";
import playerTwo from "../assets/player-two.svg";

interface MainMenuProps {
  socket: Socket;
  playerIndex: 0 | 1;
}

import { useSelector } from "react-redux";
import { RootState } from "../reducers";

function PlayerScore({ socket, playerIndex }: MainMenuProps) {
  const room = useSelector((state: RootState) => state.roomData);
  return (
    <Conteiner>
      <PlayerImage src={playerIndex === 0 ? playerOne : playerTwo} />
      <PlayerName>
        {room.players[playerIndex]
          ? room.players[playerIndex].playerId === socket.id
            ? "You"
            : room.players[playerIndex].playerName
          : `Player${playerIndex}`}
      </PlayerName>
      <PlayerOvertime>
        Extra time:{" "}
        <span
          style={
            room.players[playerIndex] &&
            (room.players[playerIndex].overtimeTime < 5 ? { color: "red" } : {})
          }
        >
          {room.players[playerIndex]
            ? room.players[playerIndex].overtimeTime
            : 20}
        </span>
      </PlayerOvertime>
      <PlayerWins>Wins: {room.game.score.playerOneWins}</PlayerWins>
    </Conteiner>
  );
}
export default PlayerScore;

const Conteiner = styled.div`
  width: 150px;
  height: 100px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  position: relative;

  box-shadow: 1px 5px 1px;
  background-color: white;
  border: 3px solid black;
  border-radius: 25px;
  margin-bottom: 80px;
  padding-bottom: 20px;
`;
const PlayerOvertime = styled.p`
  font-size: 16px;
  font-weight: 500;
`;
const PlayerWins = styled.p`
  font-size: 24px;
  font-weight: 500;
`;
const PlayerImage = styled.img`
  position: absolute;
  transform: scale(0.8);
  top: -25px;
  user-select: none;
`;
const PlayerName = styled.p`
  font-size: 16px;
  font-weight: 500;
`;
