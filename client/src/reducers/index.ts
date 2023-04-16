import { combineReducers, Reducer } from 'redux';

import roomData, { roomType, roomDataAction } from "./roomData";
import showRules, { showRulesAction } from "./showRules";
import showLobbys, { showLobbysAction } from "./showLobbys";

export interface RootState {
  roomData: roomType;
  showRules: boolean;
  showLobbys: boolean;
}

const rootReducer: Reducer<RootState, roomDataAction | showRulesAction | showLobbysAction > = combineReducers({
  roomData,
  showRules,
  showLobbys
});

export default rootReducer;