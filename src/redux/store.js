import { createStore,combineReducers } from "redux";
import { collapsedReducers } from "./reducers/collapsed";
import loadingReducers from "./reducers/loadingReducers";

const reducers = combineReducers({
  collapsedReducers,
  loadingReducers
})

const store = createStore(reducers)

export default store

