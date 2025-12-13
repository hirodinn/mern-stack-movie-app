const initialValue = {
  user: null,
  darkMode: JSON.parse(localStorage.getItem("dark")) || false,
};
export default function UserInfoReducer(state = initialValue, action) {
  if (action.type === "SETUSER") {
    const temp = { ...state };
    temp.user = action.payload;
    return temp;
  } else if (action.type === "THEME") {
    const temp = { ...state };
    temp.darkMode = action.payload;
    localStorage.setItem("dark", action.payload);
    return temp;
  } else {
    return state;
  }
}
