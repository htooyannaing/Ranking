import { FETCH_USER, AUTH_USER, UNAUTH_USER } from "../actions/types";

export default function(state = false, action) {
	switch (action.type) {
		case AUTH_USER:
			return action.payload;
		case UNAUTH_USER:
			return action.payload;
		case FETCH_USER:
			return action.payload || false;
		default:
			return state;
	}
}
