import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import cartReducer from "../features/cartSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
