import { UPLOAD_WRONG_USER_INFO, UPLOAD_WRONG_UNI_INFO } from "../actions/types";

export default function(state = [], action) {
	switch (action.type) {
		case UPLOAD_WRONG_USER_INFO:
			return action.payload;
		case UPLOAD_WRONG_UNI_INFO:
			return action.payload;
		default:
			return state;
	}
}