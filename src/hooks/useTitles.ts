import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {type LocalString} from "hooks/useTranslate.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "store.ts";

interface Title {
  parent?: LocalString
  title: LocalString | undefined
}

type TitlePayload = { pathname: string, title: Title | undefined | null };

export const titleSlice = createSlice({
  name: "titles",
  initialState: {} as {[key: string]: Title},
  reducers: {
    addTitle: (state, action: PayloadAction<TitlePayload>) => {
      const { pathname, title } = action.payload;
      if (title && state[pathname]?.title?.en !== title.title?.en) {
        state[pathname] = title;
      }
    }
  }
});

export const useSetTitle = (title: Title | undefined | null) => {
  const addTitle = useAddTitle();
  const { pathname } = useLocation();
  useEffect(() => {
    addTitle(pathname, title);
  }, [addTitle, title, pathname]);
}

export const useAddTitle = () => {
  const dispatch = useDispatch();
  return (pathname: string, title: Title | undefined | null) =>
    dispatch(titleSlice.actions.addTitle({ pathname, title }));
}

export const useTitles = () => useSelector((state: RootState) => state.titles)

export const extractTitle = (instance: { title: string, entityType: { titlePlural: LocalString } } | null) => ({
  title: {en: instance?.title ?? "New request", nl: instance?.title ?? "Nieuw verzoek"},
  parent: instance?.entityType.titlePlural ?? {en: "Requests", nl: "Verzoeken"}
})