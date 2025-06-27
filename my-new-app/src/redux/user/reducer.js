import { SET_USER } from "./actions";
// import { store } from './redux/store'; // ✅ Correct path

const initialState = null;

export function userDetails(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default:
      return state;
  }
}