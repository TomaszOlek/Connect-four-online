import styled from "styled-components";
import { Socket } from "socket.io-client";

import playerOne from "../assets/player-one.svg";
import playerTwo from "../assets/player-two.svg";

interface MainMenuProps {
  socket: Socket;
  playerIndex: 0 | 1;
  players: {
    playerId: String;
    playerName: String;
  }[];
}

function PlayerScore({ socket, players, playerIndex }: MainMenuProps) {
  return (
    <Conteiner>
      <PlayerImage src={playerIndex === 0 ? playerOne : playerTwo} />
      <PlayerName>
        {players[playerIndex]
          ? players[playerIndex].playerId === socket.id
            ? "You"
            : players[playerIndex].playerName
          : `Player${playerIndex}`}
      </PlayerName>
    </Conteiner>
  );
}

export default PlayerScore;

const Conteiner = styled.div`
  width: 100px;
  height: 120px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;

  box-shadow: 1px 5px 1px;
  background-color: white;
  border: 3px solid black;
  border-radius: 25px;
  margin-bottom: 80px;
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
