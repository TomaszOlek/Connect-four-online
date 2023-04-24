import styled, { keyframes } from "styled-components";
import { Socket } from "socket.io-client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducers";

import { handleChipDrop, getNextMove } from "./BotComponents/BoardFunctions";

import { updateRoomData } from "../actions";

type WinConteinerType = {
  gameState: {
    state: string;
    player: 1 | 2;
  };
};
function isEven(value: number) {
  return value % 2 === 0;
}

function GameInformation({ socket }: { socket: Socket }) {
  const room = useSelector((state: RootState) => state.roomData);
  const dispatch = useDispatch();

  function handleStartNewGame() {
    socket.emit("resetGame", room.lobby);
  }
  function handleStartNewLocalGame() {
    let roomCoppy = JSON.parse(JSON.stringify(room));
    roomCoppy.game.board = Array.from({ length: 7 }, () => Array(6).fill(0));

    const isPlayerOneTurn = isEven(
      room.game.score.playerOneWins + room.game.score.playerTwoWins
    );

    roomCoppy.game.playerTurn = {
      playerIndex: isPlayerOneTurn ? 1 : 2,
      playerName: isPlayerOneTurn ? "Player" : "Bot",
    };

    roomCoppy.game.state = "gameStarted";

    if (!isPlayerOneTurn) {
      setTimeout(() => {
        getNextMove(roomCoppy.game.board, 2).then((move) => {
          roomCoppy = handleChipDrop(roomCoppy, move.columnMove);
          dispatch(updateRoomData(roomCoppy));
          console.log("Bot move ", move.columnMove);
        });
      }, 200);
    } else {
      dispatch(updateRoomData(roomCoppy));
    }
  }

  return (
    <WinContainer
      gameState={{
        state: room.game.state,
        player: room.game.playerTurn.playerIndex,
      }}
    >
      {room.game.state === "gameEnded" && room.game.score.lastWin && (
        <div>
          {room.game.score.lastWin === "draw" ? (
            room.lobby.startsWith("Local") ? (
              <>
                <h3>Draw</h3>
                <button onClick={() => handleStartNewLocalGame()}>
                  Play again
                </button>
              </>
            ) : (
              <>
                <h3>Draw</h3>
                <button onClick={() => handleStartNewGame()}>
                  Play again{" "}
                  {room.startNewGameVotes ? room.startNewGameVotes.votes : 0}/2
                </button>
              </>
            )
          ) : room.lobby.startsWith("Local") ? (
            <>
              <h3>{room.game.score.lastWin === 1 ? "You Won" : "Bot Wins"}</h3>
              <button onClick={() => handleStartNewLocalGame()}>
                Play again
              </button>
            </>
          ) : (
            <>
              {" "}
              <p>{room.players[room.game.score.lastWin - 1].playerName}</p>
              <h3>Wins</h3>
              <button onClick={() => handleStartNewGame()}>
                Play again{" "}
                {room.startNewGameVotes ? room.startNewGameVotes.votes : 0}/2
              </button>
            </>
          )}
        </div>
      )}

      {room.game.state !== "gameEnded" &&
        (room.lobby.startsWith("Local") ? (
          <>
            {room.game.playerTurn.playerName === "Player" ? (
              <PlayerNameTurn style={{ fontSize: "24px" }}>
                Your Turn
              </PlayerNameTurn>
            ) : (
              <>
                <PlayerNameTurn
                  style={{ fontSize: "24px", marginBottom: "20px" }}
                >
                  Bot's Trun
                </PlayerNameTurn>
                <div style={{ position: "absolute", bottom: "25px" }}>
                  <Loader>
                    <Dot />
                    <Dot />
                    <Dot />
                    <Dot />
                  </Loader>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <PlayerNameTurn>{`${room.game.playerTurn.playerName}'s TURN`}</PlayerNameTurn>
            {room.game.playerTurn.remainingTime === "FirstMove" ? (
              <p>Waiting For First Move!</p>
            ) : room.game.playerTurn.remainingTime !== 0 ? (
              <h3>{room.game.playerTurn.remainingTime}S</h3>
            ) : (
              <h2>{`
              Overtime ${
                room.players[room.game.playerTurn.playerIndex - 1].overtimeTime
              }S
            `}</h2>
            )}
          </>
        ))}
    </WinContainer>
  );
}

export default GameInformation;
const Loader = styled.div`
  display: inline-block;
  position: relative;

  margin-left: 10px;
  width: 30px;
  height: 30px;
`;
const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const ldsEllipsis2 = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(6px, 0);
    }
`;
const ldsEllipsis3 = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
`;
const Dot = styled.div`
  position: absolute;
  top: 10px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    left: 2px;
    animation: ${ldsEllipsis1} 0.6s infinite;
  }
  &:nth-child(2) {
    left: 2px;
    animation: ${ldsEllipsis2} 0.6s infinite;
  }
  &:nth-child(3) {
    left: 7px;
    animation: ${ldsEllipsis2} 0.6s infinite;
  }
  &:nth-child(4) {
    left: 13px;
    animation: ${ldsEllipsis3} 0.6s infinite;
  }
`;
const PlayerNameTurn = styled.p`
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;
const WinContainer = styled.div<WinConteinerType>`
  width: 180px;
  height: 130px;

  box-shadow: 1px 5px 1px;
  background-color: white;
  border: 3px solid black;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  position: absolute;
  bottom: 30px;

  ${(props) =>
    props.gameState.state === "gameEnded"
      ? `
      background-color: #fff;
    `
      : props.gameState.player === 1
      ? `
        background-color: #eb607e;
      `
      : `
        background-color: #ffcf68;
      `}

  & p {
    text-align: center;
    font-weight: 500;
    font-size: 12px;
  }
  & h3 {
    text-transform: uppercase;
    text-align: center;
    font-weight: 600;
    font-size: 26px;
  }
  & button {
    padding: 10px 17px;

    border: none;
    outline: none;
    border-radius: 20px;

    background-color: #7a45ff;
    color: white;

    text-transform: uppercase;

    &:hover {
      background-color: #693ec7;
      color: #d4d4d4;
    }
    &:active {
      background-color: #5933ab;
    }
  }
`;
