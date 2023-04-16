import { useEffect, useState } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

function LobbyCreation({ socket }: { socket: Socket }) {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");
  const [preivetLobbys, setPreivetLobbys] = useState([]);

  useEffect(() => {
    socket.on("updatePrivetLobbys", (lobbys) => {
      setPreivetLobbys(lobbys);
    });

    return () => {
      socket.off("updatePrivetLobbys");
    };
  }, [socket]);

  const handelCreateLobby = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (lobbyPassword === "") {
      //Need to add pass
    } else if (lobbyName in preivetLobbys) {
      //Lobby Namme taken
    } else {
      socket.emit("createPrivateLobby");
    }
  };

  return (
    <Container>
      <Form onSubmit={handelCreateLobby}>
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
          type="text"
          required
          maxLength={20}
          onChange={(e) => setLobbyPassword(e.target.value)}
        />
        <button type="submit">Create</button>
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

const Container = styled.div`
  width: 200px;
  height: 100px;

  border: 1px solid black;
  padding: 10px;
`;
