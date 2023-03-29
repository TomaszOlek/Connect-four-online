import styled from "styled-components";

function GameInformationContainer({ gameInfo }: { gameInfo: string }) {
  console.log(gameInfo);
  return (
    <WinConteiner
      playerTurn={
        gameInfo.state === "gameStarted" ? gameInfo.playerTurn.playerName : ""
      }
    >
      {gameInfo.state === "gameEnded" ? (
        <>
          <p>Player 1</p>
          <h3>Wins</h3>
          <button>Play again</button>
        </>
      ) : (
        <>
          <PlayerNameTurn>{`${gameInfo.playerTurn.playerName}'s TURN`}</PlayerNameTurn>
          <h3>4s</h3>
        </>
      )}
    </WinConteiner>
  );
}

export default GameInformationContainer;
const PlayerNameTurn = styled.p`
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const WinConteiner = styled.div`
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
    props.playerTurn === "Player1"
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
  }
`;
