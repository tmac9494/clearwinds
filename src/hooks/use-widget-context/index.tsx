import React, { PropsWithChildren, useContext, useReducer } from "react";
import { WidgetContextReducer } from "./reducer";
import { getWidgetStateFromStorage } from "../../utils";
import { WidgetContainerProps } from "../../components/widget-container";
import {
  CountersState,
  WidgetContextActions,
  WidgetContextState,
} from "./types";

const WidgetContext = React.createContext<{
  widgets: WidgetContainerProps[];
  counters: CountersState;
  pieCounters: Record<string, string[]>;
}>({
  widgets: [],
  counters: {},
  pieCounters: {},
});
const WidgetContextDispatch = React.createContext<any>({});

export const WidgetContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const initialState = getWidgetStateFromStorage();

  const [state, stateDispatch] = useReducer<
    React.Reducer<WidgetContextState, WidgetContextActions>
  >(WidgetContextReducer, initialState);

  const { widgets, counters, pieCounters } = state;

  const memoizedWidgets = React.useMemo(
    () =>
      Object.values(widgets).sort(
        (a: any, b: any) => a.position.index - b.position.index
      ),
    [widgets]
  );

  const memoizedCounters = React.useMemo(
    () => ({
      ...counters,
    }),
    [counters]
  );

  const memoizedPieCounters = React.useMemo(
    () => ({
      ...pieCounters,
    }),
    [pieCounters]
  );

  const memoizedReturn = React.useMemo(
    () => ({
      widgets: memoizedWidgets,
      counters: memoizedCounters,
      pieCounters: memoizedPieCounters,
    }),
    [memoizedWidgets, memoizedCounters, memoizedPieCounters]
  );

  return (
    <WidgetContext.Provider value={memoizedReturn}>
      <WidgetContextDispatch.Provider value={stateDispatch}>
        {children}
      </WidgetContextDispatch.Provider>
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error(
      "useWidgetContext must be used within a WidgetContextProvider"
    );
  }
  return context;
};

export const useWidgets = () => {
  const { widgets } = useWidgetContext();
  return widgets;
};

export const useCounters = () => {
  const { counters } = useWidgetContext();
  return counters;
};

export const usePieCounters = () => {
  const { pieCounters } = useWidgetContext();
  return pieCounters;
};

export const useWidgetContextDispatch = () => {
  const context = useContext(WidgetContextDispatch);
  if (!context) {
    throw new Error(
      "useWidgetContextDispatch must be used within a WidgetContextProvider"
    );
  }
  return context;
};

export * from "./types";
