import { WidgetContainerProps } from "../../components/widget-container";

export enum ActionTypes {
  ADD_WIDGET = "ADD_WIDGET",
  REMOVE_WIDGET = "REMOVE_WIDGET",
  SWAP_WIDGETS = "SWAP_WIDGETS",
  SET_COUNTER = "SET_COUNTER",
  RESET_COUNTER = "RESET_COUNTER",
  RESET_DATA_TABLE = "RESET_DATA_TABLE",
  RESET_REFRESH = "RESET_REFRESH",
  RESET_CHART = "RESET_CHART",
  ADD_COUNTER_TO_CHART = "ADD_COUNTER_TO_CHART",
  REMOVE_COUNTER_FROM_CHART = "REMOVE_COUNTER_FROM_CHART",
}

export type WidgetState = Record<string, WidgetContainerProps>;
export type CountersState = Record<string, number>;
export type PieCounterState = Record<string, string[]>;

export type WidgetContextState = {
  widgets: WidgetState;
  counters: CountersState;
  pieCounters: PieCounterState;
};

export type WidgetContextActions = {
  type: ActionTypes;
  payload: any;
};
