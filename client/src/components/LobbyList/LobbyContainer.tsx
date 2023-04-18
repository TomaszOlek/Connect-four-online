import styled from "styled-components";
import { Socket } from "socket.io-client";

import { useDispatch } from "react-redux";
import { updateShowLobbys } from "../../actions";

import LobbyCreation from "./LobbyCreation";
import LobbysList from "./LobbysList";

function LobbyContainer({ socket }: { socket: Socket }) {
  const dispatch = useDispatch();

  const handleHideLobbys = () => {
    dispatch(updateShowLobbys(false));
  };

  return (
    <ConteinerBackground onClick={handleHideLobbys}>
      <Conteiner onClick={(e) => e.stopPropagation()}>
        <LobbyCreation socket={socket} />
        <LobbysList socket={socket} />
      </Conteiner>
    </ConteinerBackground>
  );
}

export default LobbyContainer;

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
const Conteiner = styled.div`
  width: 500px;
  padding: 40px 30px;

  background-color: white;
  border: 3px solid black;
  border-radius: 20px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 2;
`;
