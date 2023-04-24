import { roomType } from "../reducers/roomData"

export const updateRoomData = (roomData: roomType) => ({
  type: "roomData/updateRoomData",
  payload: roomData
});

export const restartRoomData = () => ({
  type: "roomData/resetRoomData",
});

export const updatePrivateRoomData = (roomData: roomType) => ({
  type: "privateRoomData/updatePrivateRoomData",
  payload: roomData
});

export const updateShowRules = (showRules: boolean) => ({
  type: "showRules/updateShowRules",
  payload: showRules
});

export const updateShowLobbys = (showLobbys: boolean) => ({
  type: "showLobbys/updateShowLobbys",
  payload: showLobbys
});

export const updateShowBotDifficult = (showBotDifficult: boolean) => ({
  type: "showBotDifficulty/updateShowBotDifficulty",
  payload: showBotDifficult
});
