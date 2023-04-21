import { combineReducers } from 'redux';

import roomData, { roomType } from "./roomData";
import showRules from "./showRules";
import showLobbys from "./showLobbys";
import privateRoomData, { privateRoomType } from "./privateRoomData";
import showBotDifficulty from "./showBotDifficulty";

export interface RootState {
  roomData: roomType;
  showRules: boolean;
  showLobbys: boolean;
  privateRoomData: Array<privateRoomType>;
  showBotDifficulty: boolean;
}

const rootReducer = combineReducers({
  roomData,
  showRules,
  showLobbys,
  privateRoomData,
  showBotDifficulty
});

export default rootReducer;