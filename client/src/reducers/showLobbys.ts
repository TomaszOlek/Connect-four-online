
export type showLobbysAction = {
  type: "showLobbys/updateShowLobbys",
  payload: boolean
}


function showLobbys(state: boolean = false, action: showLobbysAction) {
  switch (action.type) {
    case "showLobbys/updateShowLobbys":
      return action.payload;
    default:
      return state;
  }
}

export default showLobbys;
