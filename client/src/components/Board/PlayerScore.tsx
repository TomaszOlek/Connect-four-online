import styled from "styled-components";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";

import playerOne from "../../assets/player-one.svg";
import playerTwo from "../../assets/player-two.svg";
import { RootState } from "../../reducers";

type PlayerScoreProps = {
  socket: Socket;
  playerIndex: 0 | 1;
  isLocalGame: boolean;
};

function PlayerScore({ socket, playerIndex, isLocalGame }: PlayerScoreProps) {
  const room = useSelector((state: RootState) => state.roomData);

  const playerNameLocal = playerIndex === 0 ? "You" : "Bot";

  const playerName = room.players[playerIndex]
    ? room.players[playerIndex].playerId === socket.id
      ? "You"
      : room.players[playerIndex].playerName
    : `Player${playerIndex + 1}`;

  const overtimeTime =
    !isLocalGame &&
    room.players[playerIndex] &&
    room.players[playerIndex].overtimeTime;

  const playerWins =
    playerIndex === 0
      ? room.game.score.playerOneWins
      : room.game.score.playerTwoWins;

  const overtimeTimeStyle =
    overtimeTime && overtimeTime <= 5 ? { color: "red" } : {};

  return (
    <Container>
      <PlayerImage src={playerIndex === 0 ? playerOne : playerTwo} />
      {isLocalGame ? (
        <LocalPlayerName>{playerNameLocal}</LocalPlayerName>
      ) : (
        <PlayerName>{playerName}</PlayerName>
      )}
      {!isLocalGame && (
        <PlayerOvertime style={overtimeTimeStyle}>
          Extra time:{" "}
          {room.players[playerIndex]
            ? room.players[playerIndex].overtimeTime
            : 20}
        </PlayerOvertime>
      )}
      <PlayerWins>Wins: {playerWins}</PlayerWins>
    </Container>
  );
}
export default PlayerScore;

const Container = styled.div`
  width: 150px;
  min-width: 125px;
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
const LocalPlayerName = styled.p`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 3px;
`;
