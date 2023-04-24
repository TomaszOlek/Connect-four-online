
export type showBotDifficultyAction = {
  type: "showBotDifficulty/updateShowBotDifficulty",
  payload: boolean
}


function showBotDifficulty(state: boolean = false, action: showBotDifficultyAction) {
  switch (action.type) {
    case "showBotDifficulty/updateShowBotDifficulty":
      return action.payload;
    default:
      return state;
  }
}

export default showBotDifficulty;
