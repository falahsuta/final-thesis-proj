import { combineReducers } from "redux";

const postReducer = (post = null, action) => {
  switch (action.type) {
    case "FETCH_POST":
      return action.payload;
    case "CLOSE_POST":
      return null;
    default:
      return post;
  }
};

const userReducer = (user = null, action) => {
  switch (action.type) {
    case "FETCH_CURRENTUSER":
      return action.payload;
    case "SIGNIN_CURRENTUSER":
      return action.payload;
    case "SET_CURRENTUSER":
      return action.payload;
    case "SIGNOUT_CURRENTUSER":
      return action.payload;
    default:
      return user;
  }
};

const showReducer = (show = true, action) => {
  switch (action.type) {
    case "NAVIGATE":
      return false;
    case "ANTI_NAVIGATE":
      return true;
    default:
      return show;
  }
};

const timelineReducer = (timeline = null, action) => {
  switch (action.type) {
    case "POST_TIMELINE":
      return action.payload;
    case "TAG_TIMELINE":
      return action.payload;
    case "CLOSE_FIRSTPOST":
      return null;
    default:
      return timeline;
  }
};

const contribeReducer = (contribe = null, action) => {
  switch (action.type) {
    case "POST_CONTRIBE":
      return action.payload;
    case "CLOSE_CONTRIBE":
      return null;
    default:
      return contribe;
  }
};

export default combineReducers({
  post: postReducer,
  user: userReducer,
  show: showReducer,
  timeline: timelineReducer,
  contribe: contribeReducer,
});
