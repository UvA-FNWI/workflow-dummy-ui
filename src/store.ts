import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import {backendSlice} from "backend/endpoints.ts";
import {titleSlice} from "hooks/useTitles.ts";

export const store = configureStore({
  reducer: {
    [backendSlice.reducerPath]: backendSlice.reducer,
    [titleSlice.reducerPath]: titleSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)