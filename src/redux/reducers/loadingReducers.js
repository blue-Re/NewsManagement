const initState = {
  isLoading: true
}
const loadingReducers = (preState=initState, action) => {
  const {type, payload} = action

  switch (type) {
    case "changeLoading":
      let newState = {...preState}
      newState.isLoading = payload
      return newState

    default:
      return preState
  }
};

export default loadingReducers