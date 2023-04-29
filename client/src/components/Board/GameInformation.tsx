import styled from "styled-components";
import { Socket } from "socket.io-client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { updateRoomData } from "../../actions";

import { handleChipDrop, getNextMove } from "../BotComponents/BoardFunctions";
import Loader from "../Utils/Loader";
import { isEven } from "../Utils/Functions";

type WinConteinerType = {
  gameState: {
    state: string;
    player: 0 | 1 | 2;
  };
};

function GameInformation({ socket }: { socket: Socket }) {
  const room = useSelector((state: RootState) => state.roomData);
  const dispatch = useDispatch();

  const isLocalGame = room.lobby.startsWith("Local");

  function handleStartNewGame() {
    socket.emit("resetGame", room.lobby);
  }

  // TODO: Do somethink with this function; Move it more make it more readable
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
        });
      }, 200);
    } else {
      dispatch(updateRoomData(roomCoppy));
    }
  }

  //TODO: move functions to diffrent folder
  const renderGameEndContent = () => {
    const { lastWin } = room.game.score;

    if (lastWin === "draw") {
      return (
        <>
          <h3>Draw</h3>
          {isLocalGame ? (
            <button onClick={handleStartNewLocalGame}>Play again</button>
          ) : (
            <button onClick={handleStartNewGame}>
              Play again {room.startNewGameVotes?.votes}/2
            </button>
          )}
        </>
      );
    }

    const localMessage = lastWin === 1 ? "You Won" : "Bot Wins";

    return (
      <>
        <h2>
          {isLocalGame
            ? localMessage
            : `${room.players[lastWin - 1].playerName} Wins`}
        </h2>
        {isLocalGame ? (
          <button onClick={handleStartNewLocalGame}>Play again</button>
        ) : (
          <>
            <button onClick={handleStartNewGame}>
              Play again {room.startNewGameVotes?.votes || 0}/2
            </button>
          </>
        )}
      </>
    );
  };

  const renderGameInProgressContent = () => {
    const { playerTurn } = room.game;

    if (isLocalGame) {
      const isPlayerTurn = playerTurn.playerName === "Player";
      return (
        <>
          {isPlayerTurn ? (
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
                <Loader />
              </div>
            </>
          )}
        </>
      );
    }

    const remainingTime = playerTurn.remainingTime;

    return (
      <>
        <PlayerNameTurn>{`${room.game.playerTurn.playerName}'s TURN`}</PlayerNameTurn>
        {remainingTime === "FirstMove" ? (
          <p>Waiting For First Move!</p>
        ) : remainingTime !== 0 ? (
          <h3>{remainingTime}S</h3>
        ) : (
          <h2>{`
            Overtime ${
              room.players[room.game.playerTurn.playerIndex - 1].overtimeTime
            }S
          `}</h2>
        )}
      </>
    );
  };

  return (
    <WinContainer
      gameState={{
        state: room.game.state,
        player: room.game.playerTurn.playerIndex,
      }}
    >
      {room.game.state === "gameEnded" && renderGameEndContent()}
      {room.game.state !== "gameEnded" && renderGameInProgressContent()}
    </WinContainer>
  );
}

export default GameInformation;

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
