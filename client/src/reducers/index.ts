import { combineReducers, Reducer } from 'redux';

import roomData, { roomType, roomDataAction } from "./roomData";
import showRules, { showRulesAction } from "./showRules";

export interface RootState {
  roomData: roomType;
  showRules: boolean;
}

const rootReducer: Reducer<RootState, roomDataAction | showRulesAction > = combineReducers({
  roomData,
  showRules
});

export default rootReducer;