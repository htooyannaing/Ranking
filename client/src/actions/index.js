import axios from "axios";
import * as TYPES from "./types";
import { FETCH_UNI_LIST, COUNT_LIST, USER_LIST, REGISTER } from "./types";
import { Types } from "mongoose";

export const setLocale = lang => dispatch => {
  localStorage.setItem("srLang", lang);
  dispatch({ type: TYPES.LOCALE_SET, payload: lang });
};

var token = axios.create({
  headers: { "x-auth": localStorage.getItem("sr_token") }
});

export const fetchUser = () => async dispatch => {
  try {
    const res = await axios.get("/api/current_user");
    dispatch({ type: TYPES.FETCH_USER, payload: res.data });
  } catch (error) {
    console.error("fetchUser error ", error);
  }
};
export const register = user => async dispatch => {
  try {
    const res = await axios.post("/api/updateUniversity", user);
    dispatch({ type: REGISTER, payload: res.data.user });
  } catch (error) {
    console.error("Signin error ", error);
  }
};

export function uniDelete(uniId) {
  return function(dispatch) {
    axios
      .post("/api/deleteUniversity", { id: uniId })
      .then(response => {
        dispatch({
          type: TYPES.DELETE_USER,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
}

/**for pass admin email and password */
export const signinAdmin = (mail, password) => async dispatch => {
  try {
    const res = await axios.post("/api/public/adminLogin", {
      mail: mail,
      password: password
    });

    dispatch({ type: TYPES.AUTH_USER, payload: res.data });
    localStorage.setItem("sr_token", res.data);
  } catch (error) {
    console.error("Signin error ", error);
    dispatch({ type: TYPES.AUTH_USER, payload: false });
  }
};

export const uploadProfileImg = () => async dispatch => {
  try {
    const res = await axios.post("/upload");
    console.log(res);

    dispatch({ type: TYPES.PROFILE_IMG, payload: res.data });
  } catch (e) {
    console.log(e);
  }
};

export const signupUser = (
  { email, password, name },
  history
) => async dispatch => {
  try {
    const res = await axios.post("/public/adminLogout", {
      email,
      password,
      name
    });
    dispatch({ type: TYPES.AUTH_USER, payload: res.data.user });
    //localStorage.setItem("token", res.data.token);
    history.push("/");
  } catch (error) {
    console.error("SingUp error ", error);
  }
};

export const singUpUserProfile = (
  { firstname, lastname, address, phone },
  history
) => async dispatch => {
  try {
    const res = await axios.post("/api/signup", {
      firstname,
      lastname,
      address,
      phone
    });
    dispatch({ type: TYPES.PROFILE, payload: res.data.user });
    //localStorage.setItem("sr.token", res.data.token);
    history.push("/home");
  } catch (e) {
    console.error("SingUpProfile error ", e);
  }
};

export const deleteProfileImg = () => async dispatch => {
  const res = await axios.post("api/deleteProfileImg");
  dispatch({ type: TYPES.DELETE_PROFILE_IMG, payload: res.data });
};

export const signout = history => async dispatch => {
  try {
    await axios.get("/api/logout");
    // if (localStorage.getItem("sr_token")) {
    //   localStorage.removeItem("sr_token");
    // }
    dispatch({ type: TYPES.UNAUTH_USER, payload: false });
    history.push("/");
  } catch (error) {
    console.error("SingOut error ", error);
  }
};

export const fetchUniLists = () => async dispatch => {
  try {
    const res = await token.get("/api/universityList");
    console.log(res.data);
    
    dispatch({ type: TYPES.FETCH_ALL_UNI_LIST, payload: res.data });
  } catch (e) {
    console.log(e);
  }
};

export const fetchUniList = ({ pgno, limit }) => async dispatch => {
  const res = await token.post("/api/universityListLimit", { pgno, limit });

  dispatch({ type: FETCH_UNI_LIST, payload: res.data });
};

// export const fetchuserList = ({ pgno, limit }) => async dispatch => {
//   const res = await axios.post("/api/userListLimit/", { pgno, limit });
//   dispatch({ type: USER_LIST, p    dispatch({ type: TYPES.VALIDATE_TYPE, payload: res.data });
// } catch (error) {
  //  console.error("ValidateType ", error);
 // }
//};

export const fetchValidateType = table_name => async dispatch => {
  try {
    // debugger;
    // localStorage.getItem("sr_token");
    // const headers = new Headers({
    //   "x-auth": localStorage.getItem("sr_token"),
    //   "Content-Type": "application/json"
    // });
    // const myHeaders = new Headers();

    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("x-auth", localStorage.getItem("sr_token"));
    // console.log(myHeaders);

    const res = await token.post("/api/formDefinationDataList", {
      table_name
    });

    dispatch({ type: TYPES.VALIDATE_TYPE, payload: res.data });
  } catch (error) {
    console.error("ValidateType ", error);
  }
};

export const uploadPersonalStatusFlag = ( 
  userId,
  status_flag
) => async dispatch => {
  const res = await token.post("/api/updatePersonalStatusFlag", {
    userId,
    status_flag
  });

  dispatch({ type: TYPES.UPLOAD_PERSONAL_STATUS_FLAG, payload: res.data });
};

export const updateWrongUserInfo = (userId, wrongInfo) => async dispatch => {
  const res = await token.post("/api/updateWrongUserInfo", {
    userId,
    wrongInfo
  });
  dispatch({ type: TYPES.UPLOAD_WRONG_USER_INFO, payload: res.data });
};

export const getWrongUserInfos = userId => async dispatch => {
  const res = await token.post("/api/getWrongUser", { userId });
  console.log(res.data);
  
  dispatch({ type: TYPES.FIND_WRONG_USER_INFO, payload: res.data });
};
export const countList = () => async dispatch => {
  const res = await axios.get("/api/uniCount");
  console.log("res", res);

  dispatch({ type: COUNT_LIST, payload: res.data });
};
export const fetchUserList = ({ pgno, limit }) => async dispatch => {
  try {
    const res = await token.post("/api/userListLimit", { pgno, limit });

    dispatch({ type: USER_LIST, payload: res.data });
  } catch (error) {
    console.error("ValidateType ", error);
  }
};

export const fetchUserLists = () => async dispatch => {
  try {
    const res = await token.get("/api/userList");
    console.log(res.data);
    
    dispatch({ type: TYPES.FETCH_ALL_USER_LIST, payload: res.data });
  } catch (error) {
    console.error("ValidateType ", error);
  }
};

export const fetchallUniLists = () => async dispatch => {
  try{
    const res = await axios.get("/api/universityList");
    console.log(res.data);
    
    dispatch({ type: TYPES.FETCH_ALL_UNI_LIST, payload: res.data });
  }catch(e) {
    console.log(e);
  }
}

export const uploadUniStatusFlag = (
  uniId,
  status_flag
) => async dispatch => {
  const res = await axios.post("/api/updateUniStatusFlag", {
    uniId,
    status_flag
  });

  dispatch({ type: TYPES.UPLOAD_UNI_STATUS_FLAG, payload: res.data });
};

export const getProfileImg = (imageId) => async dispatch => {
  try {
    const res = await token.get(`/api/photo/${imageId}`);
    dispatch({type: TYPES.GET_PROFILE_IMAGE, payload: res.data});
  } catch (e) {
    console.log(e);
  }
}
