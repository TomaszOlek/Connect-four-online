import { roomType } from "../reducers/roomData"

export const updateRoomData = (roomData: roomType) => ({
  type: "roomData/updateRoomData",
  payload: roomData
});

export const updateShowRules = (showRules: boolean) => ({
  type: "showRules/updateShowRules",
  payload: showRules
});

