import { FETCH_UNI_LIST, FETCH_ALL_UNI_LIST } from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_UNI_LIST:
      return action.payload;
    case FETCH_ALL_UNI_LIST:
      return action.payload;
    default:
      return state;
  }
}
