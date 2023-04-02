
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
      lastWind: null | 1 | 2;
      playerOneWins: number;
      playerTwoWins: number;
    };
  };
  players: Array<PlayerType>;
  timeRunning: boolean;
};


function roomData(state: roomType, action: roomDataAction) {
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
