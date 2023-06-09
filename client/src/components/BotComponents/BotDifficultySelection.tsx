import styled from "styled-components";
import { Icon } from "@iconify/react";

import { useDispatch } from "react-redux";
import { updateShowBotDifficult, updateRoomData } from "../../actions";

import { roomType } from "../../reducers/roomData";

interface ButtonProps {
  backgroundColor: string;
}
interface DifficultyScores {
  [key: number]: string;
}

const difficultyScores: DifficultyScores = {
  2: "Easy",
  4: "Medium",
  6: "Hard",
};

export default function BotDifficultySelection() {
  const dispatch = useDispatch();

  const handleHideLobbys = () => {
    dispatch(updateShowBotDifficult(false));
  };

  const setLobbyWithBotDifficulty = (difficulty: number) => {
    const Section: roomType = {
      lobby: `Local | Difficulty: ${difficultyScores[difficulty]}`,
      game: {
        state: "gameStarted",
        difficulty: difficulty,
        board: Array.from({ length: 7 }, () => Array(6).fill(0)),
        playerTurn: {
          playerName: "Player",
          playerIndex: 1,
        },
        score: {
          lastWin: 0,
          playerOneWins: 0,
          playerTwoWins: 0,
        },
      },
    };
    dispatch(updateRoomData(Section));
    dispatch(updateShowBotDifficult(false));
  };

  return (
    <ConteinerBackground onClick={handleHideLobbys}>
      <Conteiner onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "10px" }}>Chose Bot Difficulty :</h2>
        <Button
          backgroundColor="#21d91e"
          onClick={() => setLobbyWithBotDifficulty(2)}
        >
          Easy
          <Icon icon="mdi:face-happy-outline" />
        </Button>
        <Button
          backgroundColor="#fda839"
          onClick={() => setLobbyWithBotDifficulty(4)}
        >
          Medium
          <Icon icon="mdi:emoticon-angry-outline" />
        </Button>
        <Button
          backgroundColor="#d84040"
          onClick={() => setLobbyWithBotDifficulty(6)}
        >
          Hard
          <Icon icon="mdi:emoticon-devil-outline" />
        </Button>
      </Conteiner>
    </ConteinerBackground>
  );
}

const Button = styled.button<ButtonProps>`
  width: 200px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#fbeee0"};
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  padding: 0 27px;

  line-height: 50px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: filter 0.3s;

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  & svg {
    width: 24px;
    height: 24px;
  }
`;
const Conteiner = styled.div`
  width: 300px;
  padding: 40px 30px;

  background-color: white;
  border: 3px solid black;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 2;
`;

const ConteinerBackground = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #3632325e;
  z-index: 2;
`;
