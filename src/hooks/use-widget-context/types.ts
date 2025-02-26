import { WidgetContainerProps } from "../../components/widget-container";

export enum ActionTypes {
  ADD_WIDGET = "ADD_WIDGET",
  REMOVE_WIDGET = "REMOVE_WIDGET",
  SWAP_WIDGETS = "SWAP_WIDGETS",
}

export type WidgetContextState = Record<string, WidgetContainerProps>;

export type WidgetContextActions = {
  type: ActionTypes;
  payload: any;
};
