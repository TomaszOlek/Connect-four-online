import { combineReducers, Reducer } from 'redux';

import roomData, { roomType, roomDataAction } from "./roomData";

export interface RootState {
  roomData: roomType;
}

const rootReducer: Reducer<RootState, roomDataAction > = combineReducers({
  roomData,
});

export default rootReducer;