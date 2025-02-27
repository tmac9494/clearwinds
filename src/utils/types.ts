import { PropsWithChildren } from "react";

export enum WidgetTypes {
  dataTable = "dataTable",
  counter = "counter",
  chart = "chart",
}

export type WidgetState = {
  id: string;
  position: {
    index: number;
    width: number;
    height: number;
  };
  config: {
    title: string;
  };
  type: WidgetTypes;
  refetchInterval?: number;
  refresh?: boolean;
};

export interface WidgetContainerProps extends PropsWithChildren<WidgetState> {
  width: number;
  height: number;
  draggable?: boolean;
  animatable?: boolean;
}

export type TableData = {
  id: string;
  name: string;
  username: number;
  email: string;
  address: {
    city: string;
    zipcode: string;
  };
};
