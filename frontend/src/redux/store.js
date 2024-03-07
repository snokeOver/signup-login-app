import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice.js";
import themeReducer from "./themeSlice.js";

//Configure for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Wrap each reducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedThemeReducer = persistReducer(persistConfig, themeReducer);

const store = configureStore({
  reducer: {
    //Add Reducers
    user: persistedUserReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default store;
export { persistor };
