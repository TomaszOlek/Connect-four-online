
export type RoomType = {
  lobby: string;
  game: {
    state: string;
    board: Array<Array<0 | 1 | 2>>;
    playerTurn: {
      playerId: string;
      playerName: string;
      playerIndex: 1 | 2
      remainingTime: number | "FirstMove";
    };
    score: {
      lastWin: 0 | 1 | 2 | "draw";
      playerOneWins: number;
      playerTwoWins: number;
    };
  };
  players: Array<PlayerType>;
  timeRunning: boolean;
  startNewGameVotes?: {
    votes: number;
    playersVoted: Array<string>
  }
};

export type PlayerType = {
  playerId: string;
  playerName: string;
  overtimeTime: number;
};