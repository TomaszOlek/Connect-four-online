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
    <ContainerBackground onClick={handleHideLobbys}>
      <Container onClick={(e) => e.stopPropagation()}>
        <LobbyCreation socket={socket} />
        <LobbysList socket={socket} />
      </Container>
    </ContainerBackground>
  );
}

export default LobbyContainer;

const ContainerBackground = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(54, 50, 50, 0.37);
  z-index: 2;
`;
const Container = styled.div`
  width: 500px;
  padding: 40px 30px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 2;

  background-color: white;
  border: 3px solid black;
  border-radius: 20px;
`;
