import { useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

function LobbyCreation({ socket }: { socket: Socket }) {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");

  const privateLobbys = useSelector(
    (state: RootState) => state.privateRoomData
  );

  const handleCreateLobby = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (privateLobbys.some((item) => item.lobbyName === lobbyName)) {
      console.log("LobbyName Taken"); //TODO: LobbyName Taken Notification
    } else {
      socket.emit("createPrivateLobby", { lobbyName, lobbyPassword });
    }
  };

  return (
    <Container>
      <Form onSubmit={handleCreateLobby}>
        <h4>Create Lobby</h4>
        <Input
          placeholder="Lobby name"
          type="text"
          required
          maxLength={16}
          onChange={(e) => setLobbyName(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          required
          maxLength={20}
          onChange={(e) => setLobbyPassword(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
}

export default LobbyCreation;

const Input = styled.input`
  border: 1px solid black;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Button = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }
`;

const Container = styled.div`
  width: 200px;
  height: 100px;

  border: 1px solid black;
  padding: 10px;
`;
