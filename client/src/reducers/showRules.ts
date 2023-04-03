
export type showRulesAction = {
  type: "showRules/updateShowRules";
  payload: boolean;
}


function showRules(state: boolean = false, action: showRulesAction) {
  switch (action.type) {
    case "showRules/updateShowRules":
      return action.payload;
    default:
      return state;
  }
}

export default showRules;
