import axios from "axios";
import Cookies from 'js-cookie'



export const fetchPost = (id) => async (dispatch) => {
  const response = await axios.get(`http://localhost:4002/api/posts/?p=${id}`);
  dispatch({ type: "FETCH_POST", payload: response.data });
};

export const closePost = () => {
  return {
    type: "CLOSE_POST",
  };
};

export const getCurrentUser = () => async (dispatch) => {
  const response = await axios.get(
    "http://localhost:4001/api/users/currentUser",
    { withCredentials: true }
  );

  console.log("TEEEESTTTT")
  dispatch({ type: "FETCH_CURRENTUSER", payload: response.data });
};

export const signIn = (value) => async (dispatch) => {
  // const headers = {
  //   "Access-Control-Allow-Origin": "*",
  //   "Content-Type": "application/json",
  // };

  // const [cookies, setCookie] = useCookies(['access_token'])
  Cookies.set('foo', 'bar')

  let p = Cookies.get('foo')
  console.log(p)


  const response = await axios.post(
    "http://localhost:8080/login",
    value,
    // {
    //   withCredentials: true,
    //   // headers,
    // }
  );

  console.log(response.data)

  let expires = new Date()


  expires.setTime(expires.getTime() + (60 * 60 * 24 * 1000))
  // setCookie('access_token', response.data, { path: '/',  expires})

  return {
    type: "SIGNIN_CURRENTUSER",
    payload: { currentUser: response.data },
  };
};

export const setCredentials = (value) => {
  return {
    type: "SET_CURRENTUSER",
    payload: value,
  };
};

export const createPost = (value) => async (dispatch) => {
  const response = await axios.post("http://localhost:4002/api/posts", value);
  dispatch({ type: "CREATE_POST" });
};

export const signOut = () => async (dispatch) => {
  const response = await axios.post(
    "http://localhost:4001/api/users/signout",
    {},
    { withCredentials: true }
  );

  dispatch({
    type: "SIGNOUT_CURRENTUSER",
    payload: { ...response.data, currentUser: null },
  });
};

export const commentPost = (value) => async (dispatch) => {
  const response = await axios.post(
    "http://localhost:4002/api/posts/comments",
    value
  );

  dispatch({
    type: "COMMENT_POST",
  });
};

export const commentReply = (value) => async (dispatch) => {
  const response = await axios.post(
    "http://localhost:4002/api/posts/comments/replies",
    value
  );

  dispatch({
    type: "COMMENT_REPLY",
  });
};

export const getFirstPost = () => async (dispatch) => {
  const response = await axios.get(
    "http://localhost:4002/api/posts?limit=6&page=1"
  );

  dispatch({
    type: "POST_TIMELINE",
    payload: response.data,
  });
};

export const getTagPost = (tag) => async (dispatch) => {
  const response = await axios.get(
    `http://localhost:4002/api/posts?limit=6&page=1&t=${tag}`
  );

  dispatch({
    type: "TAG_TIMELINE",
    payload: response.data,
  });
};

export const getContributePost = (id) => async (dispatch) => {
  const response = await axios.get(`http://localhost:4002/api/posts?ui=${id}`);

  dispatch({
    type: "POST_CONTRIBE",
    payload: response.data.post,
  });
};

export const closeFirstPost = () => {
  return {
    type: "CLOSE_FIRSTPOST",
  };
};

export const closeContribe = () => {
  return {
    type: "CLOSE_CONTRIBE",
  };
};

export const navigate = () => {
  return {
    type: "NAVIGATE",
  };
};

export const antiNavigate = () => {
  return {
    type: "ANTI_NAVIGATE",
  };
};
