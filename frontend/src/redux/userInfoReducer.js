const initialValue = { user: null, darkMode: false };
export default function UserInfoReducer(state = initialValue, action) {
  if (action.type === "SETUSER" || action.type === "THEME") {
    const temp = { ...state, ...action.payload };
    return temp;
  } else {
    return state;
  }
}
