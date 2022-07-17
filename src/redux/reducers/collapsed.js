const initState = {
  isCollapsed: false
}
export const collapsedReducers = (preState=initState, action) => {
  const { type } = action
  switch (type) {
    case 'changeCollapsed':
      let newState = {...preState}
      newState.isCollapsed = !newState.isCollapsed
      return newState
  
    default:
      return preState
  }
}