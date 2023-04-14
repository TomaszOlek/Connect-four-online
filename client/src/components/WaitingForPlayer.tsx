import styled, { keyframes } from "styled-components";
import { Socket } from "socket.io-client";

function WaitingForPlayer({
  state,
  socket,
}: {
  state: "lookingForPlayers" | "oponentLeftLobby";
  socket: Socket;
}) {
  const handelLeaveLobby = () => {
    socket.emit("leaveLobby");
  };

  return (
    <ConteinerBackground>
      <Conteiner>
        <Text style={{ textAlign: "center", fontWeight: "500" }}>
          {state === "lookingForPlayers" ? (
            <>
              <p>Waiting for an Oponent</p>
              <Loader>
                <Dot />
                <Dot />
                <Dot />
                <Dot />
              </Loader>
            </>
          ) : (
            <p>Your oponent left the lobby. Please leave the lobby.</p>
          )}
        </Text>
        <LeaveButton onClick={() => handelLeaveLobby()}>
          Leave lobby
        </LeaveButton>
      </Conteiner>
    </ConteinerBackground>
  );
}

export default WaitingForPlayer;

const Text = styled.p`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const Conteiner = styled.div`
  height: 120px;
  padding: 0 20px;

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
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #3632325e;
  z-index: 2;
`;

const LeaveButton = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.412);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  justify-content: center;
  touch-action: manipulation;
  vertical-align: baseline;

  user-select: none;

  padding: 8px 14px;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;

  transition: all 250ms;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    background-color: #8c8c8c;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(0);
  }
`;

const Loader = styled.div`
  display: inline-block;
  position: relative;
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
