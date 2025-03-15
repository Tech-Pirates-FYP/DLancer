import { configureStore } from "@reduxjs/toolkit";
import { gigAPI } from "./gig/gigAPI";
import gigSlice from "./gig/gigSlice";
import authSlice from "./auth/authSlice"
// import proposalSlice from "./proposal/proposalSlice"
import { authAPI } from "./auth/authAPI";

export const store = configureStore ({
    reducer: {
        auth: authSlice,
        gig: gigSlice,
        // proposal: proposalSlice,
        [gigAPI.reducerPath]: gigAPI.reducer,
        [authAPI.reducerPath]: authAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(gigAPI.middleware, authAPI.middleware);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;