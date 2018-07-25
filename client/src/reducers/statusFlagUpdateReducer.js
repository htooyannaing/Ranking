import { UPLOAD_PERSONAL_STATUS_FLAG, UPLOAD_UNI_STATUS_FLAG } from "../actions/types";

export default function(state = [], action) {
	switch (action.type) {
		case UPLOAD_PERSONAL_STATUS_FLAG:
			return action.payload;
		case UPLOAD_UNI_STATUS_FLAG :
			return action.payload
		default:
			return state;
	}
}
