import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { AccountInfo, IdTokenClaims } from "@azure/msal-browser";

export interface AuthState {
  activeAccount: AccountInfo | null;
  accessToken: string | null;
  idTokenClaims: IdTokenClaims | undefined;
}

const initialState: AuthState = {
  activeAccount: null,
  accessToken: null,
  idTokenClaims: undefined,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setActiveAccount(state, action: PayloadAction<AccountInfo | null>) {
      state.activeAccount = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setIdTokenClaims(state, action: PayloadAction<IdTokenClaims | undefined>) {
      state.idTokenClaims = action.payload;
    },
  },
});

export const { setActiveAccount, setAccessToken, setIdTokenClaims } =
  userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectActiveAccount = (state: RootState) =>
  state.user.activeAccount;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectIdTokenClaims = (state: RootState) =>
  state.user.idTokenClaims;

export default userSlice.reducer;
