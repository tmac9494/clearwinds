import React, { PropsWithChildren, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ActionTypes,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context";
import "./styles.scss";
import { WidgetTypes } from "../../utils/types";
import classNames from "classnames";

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

export const WidgetContainer = ({
  id,
  position,
  config,
  children,
  width,
  height,
  draggable = true,
  animatable = true,
}: WidgetContainerProps) => {
  const widgetDispatch = useWidgetContextDispatch();

  const [animate, setAnimate] = useState(false);

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

  useEffect(() => {
    animatable && setAnimate(true);
  }, [position.index, animatable]);

  return (
    <div
      onAnimationEnd={() => animate && setAnimate(false)}
      style={{
        background: isOver ? "lightblue" : "none",
        width: `${width}px`,
        maxWidth: `${width}px`,
        height: `${height}px`,
      }}
      className={classNames(
        "widget-container",
        animate && animatable && "animate"
      )}
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
