import styled from "styled-components";

import { useDispatch } from "react-redux";
import { updateShowRules } from "../actions";

function Rules() {
  const dispatch = useDispatch();

  const handelHideRules = () => {
    dispatch(updateShowRules(false));
  };

  return (
    <ConteinerBackground onClick={handelHideRules}>
      <Conteiner>
        <h4>How To Play</h4>
        <ul>
          <li>
            Click "Play VS Player" and wait for your opponent to join the room.
          </li>
          <li>
            Both players have 15 seconds to make a move, and an additional 20
            seconds of overtime that does not reset after a move. If a player's
            overtime runs out, they automatically lose the game.
          </li>
          <li>
            To make a move, drop one of your tokens into the column of your
            choice. The token will fall down to the lowest available position in
            that column.
          </li>
          <li>
            Once you have completed your move, wait for your opponent to make
            their move.
          </li>
        </ul>
        <h4>How To Win</h4>
        <ul>
          <li>
            The goal of the game is to be the first player to connect four
            tokens of your color in a horizontal, vertical, or diagonal line on
            the game board.
          </li>
          <li>
            One effective strategy is to begin by placing your first token in
            the bottom center square position (the grid of 2x2), since this
            allows you to build your line in various directions.
          </li>
          <li>
            Pay close attention to your opponent's moves and try to block any
            potential winning lines they may be forming.
          </li>
          <li>
            When playing against a computer focus on winning the game rather
            than settling for a draw, as your chances of winning against a
            computer opponent are much higher than in a game like Tic-Tac-Toe.
          </li>
        </ul>
      </Conteiner>
    </ConteinerBackground>
  );
}

export default Rules;

const ConteinerBackground = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #3632325e;
  z-index: 2;
`;
const Conteiner = styled.div`
  width: 800px;
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
