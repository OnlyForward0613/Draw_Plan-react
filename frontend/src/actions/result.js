import api from "../utils/api";
import { SAVE_RESULT } from "./types";

export const saveResult = (data) => async (dispatch) => {
  try {
    const res = await api.put("/measure", data);

    if (res.data.respond == "success") {
      dispatch({
        type: SAVE_RESULT,
        payload: "OK",
      });
    } else {
      console.log(res.msg);
    }
  } catch (err) {
    const errors = err.response.data.errors;
  }
};