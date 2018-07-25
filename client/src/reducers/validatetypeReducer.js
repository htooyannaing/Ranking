import { VALIDATE_TYPE } from "../actions/types";

export default function(state = [], action) {
	switch (action.type) {
		case VALIDATE_TYPE:
			return action.payload;
		default:
			return state;
	}
}
