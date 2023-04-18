
export type PrivateLobbyType = {
  lobby: string;
  lobbyName: string,
  lobbyPassworld: string,
  game: {
    state: string;
    board: Array<Array<null | 1 | 2>>;
    playerTurn: {
      playerId: string;
      playerName: string;
      playerIndex: 1 | 2
      remainingTime: number | "FirstMove";
    };
    score: {
      lastWin: null | 1 | 2 | "draw";
      playerOneWins: number;
      playerTwoWins: number;
    };
  };
  players: Array<{
    playerId: string;
    playerName: string;
    overtimeTime: number;
  }>;
  timeRunning: boolean;
  startNewGameVotes?: {
    votes: number;
    playersVoted: Array<string>
  }
};