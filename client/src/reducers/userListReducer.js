import { USER_LIST } from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case USER_LIST:
      return action.payload;
    default:
      return state;
  }
}
