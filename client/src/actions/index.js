import axios from "axios";
import Cookies from 'js-cookie'

export const fetchTag = () => async (dispatch) => {
    // let p = Cookies.get('access_token')
    // let config = {
    //     headers: {Authorization: `Bearer ${p}`}
    //
    // }
    const response = await axios.get("http://localhost:8080/tags");
    dispatch({type: "FETCH_TAG", payload: response.data});
};

export const fetchPost = (id) => async (dispatch) => {
    const response = await axios.get(`http://localhost:4002/api/posts/?p=${id}`);
    dispatch({type: "FETCH_POST", payload: response.data});
};

export const closePost = () => {
    return {
        type: "CLOSE_POST",
    };
};

export const getCurrentUser = () => async (dispatch) => {
    let p = Cookies.get('access_token')

    const config = {
        headers: {Authorization: `Bearer ${p}`},

    };

    // console.log(p)

    if (p) {
        try {
            const response = await axios.get(
                "http://localhost:8080/myusers",
                config
            );

            // console.log(response.data)

            dispatch({type: "FETCH_CURRENTUSER", payload: {currentUser: response.data}});
        } catch (err) {
            dispatch({type: "FETCH_CURRENTUSER", payload: {currentUser: null}});
        }

    } else {
        dispatch({type: "FETCH_CURRENTUSER", payload: {currentUser: null}});
    }


};

export const signIn = (value) => async (dispatch) => {
    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Content-Type": "application/json",
    // };

    // const [cookies, setCookie] = useCookies(['access_token'])

    const response = await axios.post(
        "http://localhost:8080/login",
        value,
        // {
        //   withCredentials: true,
        //   // headers,
        // }
    );

    Cookies.set('access_token', response.data, {expires: 1})
    let expires = new Date()

    expires.setTime(expires.getTime() + (60 * 60 * 24 * 1000))

    let p = Cookies.get('access_token')

    const config = {
        headers: {Authorization: `Bearer ${p}`},

    };

    const response2 = await axios.get(
        "http://localhost:8080/myusers",
        config
    );


    // setCookie('access_token', response.data, { path: '/',  expires})

    return {
        type: "SIGNIN_CURRENTUSER",
        payload: {currentUser: response2.data},
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
    dispatch({type: "CREATE_POST"});
};

export const setBalanceDispatcher = (value) => async (dispatch) => {

    dispatch({type: "SET_BALANCE", payload: value});
};

export const signOut = () => async (dispatch) => {
    // const response = await axios.post(
    //   "http://localhost:4001/api/users/signout",
    //   {},
    //   { withCredentials: true }
    // );
    Cookies.remove('access_token')

    dispatch({
        type: "SIGNOUT_CURRENTUSER",
        payload: {currentUser: null},
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
        "http://localhost:8080/items/paginate?limit=6&page=1"
    );

    // console.log(response.data)

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
