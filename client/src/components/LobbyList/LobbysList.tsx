import styled from "styled-components";
import { Socket } from "socket.io-client";

import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { useState } from "react";

function LobbysList({ socket }: { socket: Socket }) {
  const [showLoginForm, setShowLoginFrom] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState(0);
  const [lobbyPassword, setLobbyPassword] = useState("");

  const privateLobbys = useSelector(
    (state: RootState) => state.privateRoomData
  );

  const handleLoginForm = (state: boolean, index: number) => {
    setShowLoginFrom(state);
    setSelectedLobby(index);
  };
  const handleJoinPrivateLobby = () => {
    const lobby = privateLobbys[selectedLobby];

    if (lobbyPassword === lobby.lobbyPassworld) {
      socket.emit("joinPrivateLobby", lobby.lobby);
    }
  };

  return (
    <Container>
      <h4>Join Lobby</h4>
      <Lobbys>
        {privateLobbys.map((item, idx) => (
          <Lobby key={idx}>
            <h4>{item.lobbyName}</h4>
            <button
              onClick={() => handleLoginForm(true, idx)}
              disabled={
                !["lookingForPlayers", "oponentLeftLobby"].includes(
                  item.game.state
                )
              }
            >
              {["lookingForPlayers", "oponentLeftLobby"].includes(
                item.game.state
              )
                ? "Join"
                : "On Going"}
            </button>
          </Lobby>
        ))}
      </Lobbys>
      {showLoginForm && (
        <LoginFormWrapper>
          <LoginForm>
            <h4>To join, please enter the password</h4>
            <h5>Lobby name: {privateLobbys[selectedLobby].lobbyName}</h5>
            <input
              placeholder="Password"
              onChange={(e) => setLobbyPassword(e.target.value)}
            />
            <button onClick={() => handleJoinPrivateLobby()}>
              Enter Password
            </button>
          </LoginForm>
        </LoginFormWrapper>
      )}
    </Container>
  );
}

export default LobbysList;

const LoginFormWrapper = styled.div`
  position: relative;
`;
const LoginForm = styled.div`
  width: 300px;
  height: 140px;

  background-color: white;
  border: 2px solid black;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  position: absolute;
  bottom: 200px;
  right: 80px;
`;
const Lobby = styled.div`
  padding: 3px 10px;

  border-bottom: 2px solid gray;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Lobbys = styled.div`
  border: 1px solid black;
  flex: 1;

  overflow: hidden;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #dbdbdb;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const Container = styled.div`
  width: 220px;
  height: 120px;

  display: flex;
  flex-direction: column;
`;
