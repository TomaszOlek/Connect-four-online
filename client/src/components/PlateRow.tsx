import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import yellowMarker from "../assets/marker-yellow.svg";
import redMarker from "../assets/marker-red.svg";

import { useSelector } from "react-redux";
import { RootState } from "../reducers";

type ChipType = {
  variant: "red" | "yellow" | "empty";
};
type RowContainerType = {
  isPlayerTurn: boolean;
};

function PlateRow({
  socket,
  index,
  row,
}: {
  socket: Socket;
  index: number;
  row: any;
}) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const room = useSelector((state: RootState) => state.roomData);
  const playerIndex = room.players.findIndex(
    (player) => player.playerId === socket.id
  );

  useEffect(() => {
    setIsPlayerTurn(room.game.playerTurn.playerId === socket.id);
  }, [room, socket]);

  const handelRowClick = (index: number) => {
    if (isPlayerTurn) {
      const playerMoveData = {
        rowSelected: index,
        playerId: socket.id,
        playerLobby: room.lobby,
      };

      socket.emit("playerMove", playerMoveData);
    } else {
      console.log("Please wait for your turn!");
    }
  };

  return (
    <RowContainer
      isPlayerTurn={isPlayerTurn}
      onClick={() => handelRowClick(index)}
    >
      <RowPointer
        id="arrow"
        src={
          room.players[playerIndex].playerName === "Player1"
            ? redMarker
            : yellowMarker
        }
      />
      {row.map((rowChip: 1 | 2 | null) => {
        switch (rowChip) {
          case 1:
            return <Chip variant="red" />;
          case 2:
            return <Chip variant="yellow" />;
          default:
            return <Chip variant="empty" />;
        }
      })}
    </RowContainer>
  );
}

const Chip = styled.div<ChipType>`
  width: 50px;
  height: 50px;

  border: 3px solid black;
  border-radius: 50%;

  ${(props) => {
    switch (props.variant) {
      case "red":
        return `
          background-color: #eb607e;
          box-shadow: inset 0.5px 3.5px 7px #1f1f1f;
        `;
      case "yellow":
        return `
          background-color: #ffcf68;
          box-shadow: inset 0.5px 3.5px 7px #1f1f1f;
        `;
      default:
        return `
          background-color: #7a45ff;
          box-shadow: inset 5px -1px 7px #1f1f1f;
        `;
    }
  }}
`;
const RowPointer = styled.img`
  position: absolute;
  display: none;
  top: -56px;
  transform: scale(0.57);
  user-select: none;
`;
const RowContainer = styled.div<RowContainerType>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 5px;

  ${(props) =>
    props.isPlayerTurn &&
    `
      &:hover > #arrow {
      display: block;
      }
    `}
`;

export default PlateRow;
