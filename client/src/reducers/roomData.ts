
export type roomDataAction = {
  type: "roomData/updateRoomData";
  payload: roomType;
}

type PlayerType = {
  playerId: string;
  playerName: string;
  overtimeTime: number;
};

export type roomType = {
  lobby: string;
  game: {
    state: string;
    board: Array<Array<null|1|2>>;
    playerTurn: {
      playerId: string;
      playerName: string;
      playerIndex: 1 | 2
      remainingTime: number | "FirstMove";
    };
    score: {
      lastWin: null | 1 | 2;
      playerOneWins: number;
      playerTwoWins: number;
    };
  };
  players: Array<PlayerType>;
  timeRunning: boolean;
};

const initialState: roomType = {
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
      lastWin: null,
      playerOneWins: 0,
      playerTwoWins: 0,
    },
  },
  players: [],
  timeRunning: false,
};


function roomData(state: roomType = initialState, action: roomDataAction) {
  switch (action.type) {
    case "roomData/updateRoomData":
      return {
        ...action.payload
      };
    default:
      return state;
  }
}

export default roomData;
