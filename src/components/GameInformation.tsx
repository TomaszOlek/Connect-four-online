import styled from "styled-components";
import { Socket } from "socket.io-client";

import { useSelector } from "react-redux";
import { RootState } from "../reducers";

type WinConteinerType = {
  gameState: {
    state: string;
    player: 1 | 2;
  };
};

function GameInformation({ socket }: { socket: Socket }) {
  const room = useSelector((state: RootState) => state.roomData);

  function handelStartNewGame() {
    socket.emit("ResetGame", room.lobby);
  }

  return (
    <WinContainer
      gameState={{
        state: room.game.state,
        player: room.game.playerTurn.playerIndex,
      }}
    >
      {room.game.state === "gameEnded" && room.game.score.lastWin ? (
        <div>
          {room.game.score.lastWin === "draw" ? (
            <>
              <h3>Draw</h3>
              <button onClick={() => handelStartNewGame()}>
                Play again{" "}
                {room.startNewGameVotes ? room.startNewGameVotes.votes : 0}/2
              </button>
            </>
          ) : (
            <>
              {" "}
              <p>{room.players[room.game.score.lastWin - 1].playerName}</p>
              <h3>Wins</h3>
              <button onClick={() => handelStartNewGame()}>
                Play again{" "}
                {room.startNewGameVotes ? room.startNewGameVotes.votes : 0}/2
              </button>
            </>
          )}
        </div>
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
      )}
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
