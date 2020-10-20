import {configureStore} from "@reduxjs/toolkit";
import {lsReducer} from "./LanguageService";

export const store = configureStore({
    reducer: {
        lsStore: lsReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
declare module "react-redux" {
    interface DefaultRootState extends RootState {
    }
}
