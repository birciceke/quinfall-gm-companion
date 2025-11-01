import { configureStore } from "@reduxjs/toolkit";

import itemReducer from "./itemSlicer";
import costumeReducer from "./costumeSlicer";
import locationReducer from "./locationSlicer";
import serverCommandsReducer from "./serverCommandsSlicer";

export const store = configureStore({
  reducer: {
    item: itemReducer,
    costume: costumeReducer,
    location: locationReducer,
    serverCommands: serverCommandsReducer,
  },
});
