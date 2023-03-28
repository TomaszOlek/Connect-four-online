import styled from "styled-components";
import { Socket } from "socket.io-client";

import playerOne from "../assets/player-one.svg";
import playerTwo from "../assets/player-two.svg";

function PlayerScore({ player }: { player: string }) {
  return (
    <Conteiner>
      <PlayerImage src={player === "playerOne" ? playerOne : playerTwo} />
      <PlayerName>{player}</PlayerName>
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

  background-color: white;
  border: 3px solid black;
  border-radius: 25px;
  margin-bottom: 80px;
`;
const PlayerImage = styled.img`
  position: absolute;
  transform: scale(0.8);
  top: -25px;
`;
const PlayerName = styled.p`
  font-size: 16px;
  font-weight: 500;
`;
