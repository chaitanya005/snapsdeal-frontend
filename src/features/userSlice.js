import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uesrInfo: {
    name: "",
    phoneNumber: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.uesrInfo = action.payload;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const getUserInfo = (state) => state.user.uesrInfo;
export default userSlice.reducer;
