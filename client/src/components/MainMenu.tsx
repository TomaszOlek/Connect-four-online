import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Socket } from "socket.io-client";

import Logo from "./Logo";

interface ButtonProps {
  backgroundColor?: string;
}

function MainMenu({ socket }: { socket: Socket }) {
  const handelJoinRoom = () => {
    socket.emit("checkForFreeGameRoom");
  };

  return (
    <Conteiner>
      <Logo />
      {/* <Button backgroundColor="#FC6787">
        Play VS Bot <Icon icon="mdi:robot-happy-outline" />
      </Button> */}
      <Button backgroundColor="#FBC02D" onClick={handelJoinRoom}>
        Play VS Player <Icon icon="mdi:emoticon-happy-outline" />
      </Button>
      <Button backgroundColor="#FFFFFF">
        Game Rules <Icon icon="material-symbols:info-outline-rounded" />
      </Button>
    </Conteiner>
  );
}

export default MainMenu;

const Conteiner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Button = styled.button<ButtonProps>`
  width: 220px;
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
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  display: flex;
  justify-content: space-around;
  align-items: center;

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
