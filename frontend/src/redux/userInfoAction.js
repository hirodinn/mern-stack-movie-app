export function add(obj) {
  return {
    type: "SETUSER",
    payload: obj,
  };
}
export function makeDark(val) {
  return {
    type: "THEME",
    payload: val,
  };
}
