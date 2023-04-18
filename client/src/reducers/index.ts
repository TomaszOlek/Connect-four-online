import { combineReducers, Reducer } from 'redux';

import roomData, { roomType, roomDataAction } from "./roomData";
import showRules, { showRulesAction } from "./showRules";
import showLobbys, { showLobbysAction } from "./showLobbys";
import privateRoomData, { privateRoomDataAction, privateRoomType } from "./privateRoomData";

export interface RootState {
  roomData: roomType;
  showRules: boolean;
  showLobbys: boolean;
  privateRoomData: Array<privateRoomType>;
}

const rootReducer = combineReducers({
  roomData,
  showRules,
  showLobbys,
  privateRoomData
});

export default rootReducer;