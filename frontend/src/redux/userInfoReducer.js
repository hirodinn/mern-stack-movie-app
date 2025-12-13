const initialValue = { user: null, darkMode: false };
export default function UserInfoReducer(state = initialValue, action) {
  if (action.type === "SETUSER") {
    const temp = { ...state };
    temp.user = action.payload;
    return temp;
  } else if (action.type === "THEME") {
    const temp = { ...state };
    temp.darkMode = action.payload;
    console.log(temp);
    return temp;
  } else {
    return state;
  }
}
