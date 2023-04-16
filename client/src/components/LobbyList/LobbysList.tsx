import styled from "styled-components";

function LobbysList() {
  return (
    <Container>
      <h4>Join Lobby</h4>
      <Lobbys>
        <Lobby>
          <h4>Lobby1</h4>
          <button>Join</button>
        </Lobby>
        <Lobby>
          <h4>Lobby1</h4>
          <button>Join</button>
        </Lobby>
        <Lobby>
          <h4>Lobby1</h4>
          <button>Join</button>
        </Lobby>
        <Lobby>
          <h4>Lobby1</h4>
          <button>Join</button>
        </Lobby>
        <Lobby>
          <h4>Lobby1</h4>
          <button>Join</button>
        </Lobby>
      </Lobbys>
    </Container>
  );
}

export default LobbysList;
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
