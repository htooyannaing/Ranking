import { combineReducers } from "redux";
import authReducer from "./authReducer";
import localeReducer from "./localeReducer";
import uniListReducer from "./uniListReducer";
import profileReducer from "./profileReducer";
import statusFlagUpdateReducer from "./statusFlagUpdateReducer";
import updateWrongInfoReducer from "./updateWrongInfoReducer";
import findWrongUserReducer from "./findWrongUserReducer";
import validatetypeReducer from "./validatetypeReducer";
import registerReducer from "./registerReducer";
import userListReducer from "./userListReducer";
import allUserListReducer from "./allUserListReducer";
import getWrongUniInfoReducer from "./getWrongUniInfoReducer";
export default combineReducers({
  auth: authReducer,
  locale: localeReducer,
  uniList: uniListReducer,
  userList: userListReducer,
  profile: profileReducer,
  updateStatus: statusFlagUpdateReducer,
  updateWrongUserInfo: updateWrongInfoReducer,
  getWrongUserInfo: findWrongUserReducer,
  getWrongUniInfo: getWrongUniInfoReducer,
  validatetype: validatetypeReducer,
  registerUser: registerReducer,
  allUserList: allUserListReducer,
});
