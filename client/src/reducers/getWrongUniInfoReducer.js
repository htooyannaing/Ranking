import { FIND_WRONG_UNI_INFO } from "../actions/types";

export default function(state = [], action) {
	switch (action.type) {
		case FIND_WRONG_UNI_INFO:
			return action.payload;
		default:
			return state;
	}
}