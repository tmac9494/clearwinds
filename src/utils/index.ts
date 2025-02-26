import { WidgetContextState } from "../hooks/useWidgetContext/types";

const WIDGET_STORAGE_KEY = "widgets";

export const getWidgetStateFromStorage = () => {
  const state = JSON.parse(localStorage.getItem(WIDGET_STORAGE_KEY) || "{}");
  return state as WidgetContextState;
};

export const saveWidgetStateToStorage = (state: WidgetContextState) => {
  localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(state));
};
