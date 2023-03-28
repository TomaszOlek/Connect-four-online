import styled from "styled-components";
import { Socket } from "socket.io-client";

import PlayerScore from "./PlayerScore";
import WaitingForPlayer from "./WaitingForPlayer";

import yellowMarker from "../assets/marker-yellow.svg";
import redMarker from "../assets/marker-red.svg";

function Board({ socket, room }: { socket: Socket; room: any }) {
  const boardProto = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ];

  const handelRowClick = (index: number) => {
    console.log(index);
  };

  return (
    <Conteiner>
      <LobbyTitle>Lobby: {room.lobbyName}</LobbyTitle>

      <PlayerScore player="playerOne" />
      <Plate>
        {boardProto.map((items, index) => (
          <PlateRow onClick={() => handelRowClick(index)}>
            <RowPointer id="arrow" src={redMarker} />
            {items.map(() => (
              <Chip />
            ))}
          </PlateRow>
        ))}
      </Plate>
      <PlayerScore player="playerTwo" />
      {room.players.length < 2 && <WaitingForPlayer />}
    </Conteiner>
  );
}

export default Board;
const Chip = styled.div`
  width: 50px;
  height: 50px;

  background-color: #7a45ff;
  border: 3px solid black;
  border-radius: 50%;
  box-shadow: inset 5px -1px 7px #1f1f1f;
`;
const RowPointer = styled.img`
  position: absolute;
  display: none;
  top: -56px;
  transform: scale(0.57);
  user-select: none;
`;
const PlateRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 5px;

  &:hover > #arrow {
    display: block;
  }
`;
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
  box-sizing: border-box;

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
