import { PROFILE, PROFILE_IMG, DELETE_PROFILE_IMG, GET_PROFILE_IMAGE } from './../actions/types'


export default function(state = false, action) {
	switch(action.type) {
        case PROFILE:
            return action.payload;
        case PROFILE_IMG:
            return action.payload;
        case DELETE_PROFILE_IMG:
            return action.payload;
        case GET_PROFILE_IMAGE:
            return action.payload;
        default:
            return state;
    }
}
