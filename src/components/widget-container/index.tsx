import React, { PropsWithChildren } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ActionTypes,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context";
import "./styles.scss";

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
};

export interface WidgetContainerProps extends PropsWithChildren<WidgetState> {
  width: number;
  height: number;
  draggable?: boolean;
}

export const WidgetContainer = ({
  id,
  position,
  config,
  children,
  width,
  height,
  draggable = true,
}: WidgetContainerProps) => {
  const widgetDispatch = useWidgetContextDispatch();

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "widget",
      item: { id, position, config },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "widget",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any) => {
      widgetDispatch({
        type: ActionTypes.SWAP_WIDGETS,
        payload: {
          source: item.id,
          destination: id,
        },
      });
    },
  }));

  return (
    <div
      style={{
        background: isOver ? "lightblue" : "none",
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="widget-container"
      ref={draggable ? (drop as any) : null}
    >
      <div
        className="draggable-content"
        ref={draggable ? (dragRef as any) : null}
        style={{ opacity }}
      >
        {children}
      </div>
    </div>
  );
};
