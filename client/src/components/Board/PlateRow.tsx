import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import yellowMarker from "../../assets/marker-yellow.svg";
import redMarker from "../../assets/marker-red.svg";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";

import { handleChipDrop, getNextMove } from "../BotComponents/BoardFunctions";

import { updateRoomData } from "../../actions";

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
  isLocalGame,
}: {
  socket: Socket;
  index: number;
  row: any;
  isLocalGame: boolean;
}) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const room = useSelector((state: RootState) => state.roomData);
  const dispatch = useDispatch();
  let playerIndex = 0;

  if (!isLocalGame && "players" in room) {
    playerIndex = room.players.findIndex(
      (player) => player.playerId === socket.id
    );
    //TODO: Player Not found
  }

  useEffect(() => {
    if (isLocalGame) {
      setIsPlayerTurn(room.game.playerTurn.playerName === "Player");
    } else if ("playerId" in room.game.playerTurn) {
      setIsPlayerTurn(room.game.playerTurn.playerId === socket.id);
    }
  }, [room, socket]);

  const handleRowClick = (index: number) => {
    if (isPlayerTurn) {
      if (isLocalGame) {
        handelLocalMove(index);
      } else {
        const playerMoveData = {
          rowSelected: index,
          playerId: socket.id,
          playerLobby: room.lobby,
        };

        socket.emit("playerMove", playerMoveData);
      }
    } else {
      console.log("Please wait for your turn!");
    }
  };

  const handelLocalMove = (index: number) => {
    if (room.game.state !== "gameStarted") {
      return;
    }

    const selectedRow = room.game.board[index];
    if (!selectedRow.includes(0)) {
      //TODO: Notification - move not allowed: no space
      return;
    }

    let roomCoppy = JSON.parse(JSON.stringify(room));
    let updatedRoom = handleChipDrop(roomCoppy, index);

    dispatch(updateRoomData(updatedRoom));

    if (updatedRoom.game.playerTurn.playerName === "Bot") {
      let roomCoppy = JSON.parse(JSON.stringify(updatedRoom));

      setTimeout(() => {
        getNextMove(updatedRoom.game.board, 2).then((move) => {
          roomCoppy = handleChipDrop(roomCoppy, move.columnMove);
          dispatch(updateRoomData(roomCoppy));
        });
      }, 200);
    }
  };

  return (
    <RowContainer
      isPlayerTurn={room.game.state === "gameStarted" && isPlayerTurn}
      onClick={() => handleRowClick(index)}
    >
      <RowPointer
        id="arrow"
        src={
          isLocalGame
            ? redMarker
            : "players" in room &&
              room.players[playerIndex].playerName === "Player1"
            ? redMarker
            : yellowMarker
        }
      />
      {row.map((rowChip: 1 | 2 | 0, index: number) => {
        switch (rowChip) {
          case 1:
            return <Chip variant="red" key={index} />;
          case 2:
            return <Chip variant="yellow" key={index} />;
          default:
            return <Chip variant="empty" key={index} />;
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
  cursor: pointer;

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
