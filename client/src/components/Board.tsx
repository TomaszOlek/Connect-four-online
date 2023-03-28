import styled from "styled-components";
import { Socket } from "socket.io-client";
import yellowMarker from "../assets/marker-yellow.svg";

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

  return (
    <Conteiner>
      <LobbyTitle>Lobby: {room.lobbyName}</LobbyTitle>
      <Plate>
        {boardProto.map((items) => (
          <PlateRow>
            <RowPointer id="arrow" src={yellowMarker} />
            {items.map(() => (
              <Chip />
            ))}
          </PlateRow>
        ))}
      </Plate>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
