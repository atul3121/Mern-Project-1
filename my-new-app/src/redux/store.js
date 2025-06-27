import { createStore, combineReducers } from "redux";
import { userDetails } from "./user/reducer";

const rootReducer = combineReducers({ userDetails });
export const store = createStore(rootReducer);