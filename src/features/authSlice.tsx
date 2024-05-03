import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  type: string | null;
  firstName: string | null;
  lastName: string | null;
  school: string | null;
  schoolName: string | null;
}

const initialState: UserState = {
  type: null,
  email: null,
  firstName: null,
  lastName: null,
  school: null,
  schoolName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.type = action.payload.type;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.school = action.payload.school;
      state.schoolName = action.payload.schoolName;

      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },

    logout: () => {
      localStorage.removeItem("access");
      localStorage.removeItem("userDetails");
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
