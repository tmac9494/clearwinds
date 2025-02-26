import React, { PropsWithChildren, useContext, useReducer } from "react";
import { WidgetContextReducer } from "./reducer";
import { getWidgetStateFromStorage } from "../../utils";
import { WidgetContainerProps } from "../../components/widget-container";

const WidgetContext = React.createContext<WidgetContainerProps[]>([]);
const WidgetContextDispatch = React.createContext<any>({});

export const useWidgetContext = () => {
  return useContext(WidgetContext);
};

export const useWidgetContextDispatch = () => {
  return useContext(WidgetContextDispatch);
};

export const WidgetContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const initialState = getWidgetStateFromStorage();

  const [widgets, widgetDispatch] = useReducer(
    WidgetContextReducer,
    initialState
  );

  const memoizedWidgets = React.useMemo(
    () =>
      Object.values(widgets).sort(
        (a: any, b: any) => a.position.index - b.position.index
      ),
    [widgets]
  );

  return (
    <WidgetContext.Provider value={memoizedWidgets}>
      <WidgetContextDispatch.Provider value={widgetDispatch}>
        {children}
      </WidgetContextDispatch.Provider>
    </WidgetContext.Provider>
  );
};

export { ActionTypes } from "./types";
