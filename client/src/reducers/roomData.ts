
export type updateRoomAction = {
  type: "roomData/updateRoomData";
  payload: roomType;
}

export type resetRoomAction = {
  type: "roomData/resetRoomData";
}

type PlayerType = {
  playerId: string;
  playerName: string;
  overtimeTime: number;
};

export type roomType = {
  lobby: string;
  lobbyName?: string;
  lobbyPassworld?: string;
  game: {
    state: string;
    board: Array<Array<0 | 1 | 2>>;
    playerTurn: {
      playerId: string;
      playerName: string;
      playerIndex: 0 | 1 | 2
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
} | {
  lobby: string;
  game: {
    state: string;
    difficulty: number;
    board: Array<Array<0 | 1 | 2>>;
    playerTurn: {
      playerName: string;
      playerIndex: 0 | 1 | 2;
    };
    score: {
      lastWin: 0 | 1 | 2 | "draw";
      playerOneWins: number;
      playerTwoWins: number;
    };
  };
};

export const initialState: roomType = {
  lobby: "",
  game: {
    state: "",
    board: [],
    playerTurn: {
      playerId: "",
      playerName: "",
      playerIndex: 1,
      remainingTime: 0,
    },
    score: {
      lastWin: 0,
      playerOneWins: 0,
      playerTwoWins: 0,
    },
  },
  players: [],
  timeRunning: false,
};



function roomData(state: roomType = initialState, action: updateRoomAction | resetRoomAction) {
  switch (action.type) {
    case "roomData/updateRoomData":
      return {
        ...action.payload
      };
    case "roomData/resetRoomData":
      return initialState;
    default:
      return state;
  }
}

export default roomData;
