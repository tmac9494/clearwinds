import { WidgetContextState } from "../hooks/use-widget-context/types";

const WIDGET_STORAGE_KEY = "widgets";

export const getWidgetStateFromStorage = () => {
  const state = JSON.parse(
    localStorage.getItem(WIDGET_STORAGE_KEY) ||
      '{ "widgets": {}, "counters": {}, "pieCounters": {} }'
  );
  return state as WidgetContextState;
};

export const saveWidgetStateToStorage = (state: WidgetContextState) => {
  localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(state));
};

export const getWidgetGridColumns = (containerWidth: number) => {
  const columnCount =
    containerWidth >= 1000 ? 5 : containerWidth >= 600 ? 3 : 2;

  return columnCount;
};

export const getWidgetGridRows = () => {
  const windowHeight = window.innerHeight;
  const rowCount = Math.floor(windowHeight / 200);
  return rowCount;
};
