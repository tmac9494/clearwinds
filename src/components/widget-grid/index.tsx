import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  ActionTypes,
  useWidgetContextDispatch,
  useWidgets,
} from "../../hooks/use-widget-context/";
import { WidgetContainer, WidgetContainerProps } from "../widget-container/";
import { CreateNewWidget } from "../create-new-widget";
import { WidgetHeader } from "../widget-header";
import "./styles.scss";
import { WidgetContent } from "../widget-content";
import { WidgetTypes } from "../../utils/types";
import { getWidgetGridColumns, getWidgetGridRows } from "../../utils";

export const WidgetGrid = () => {
  const widgets = useWidgets();
  const dispatch = useWidgetContextDispatch();

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [node, setNode] = useState<HTMLDivElement>();

  const gridColumns = getWidgetGridColumns(containerWidth);
  const gridRows = getWidgetGridRows();

  const gridItemBaseWidth = node
    ? node.getBoundingClientRect().width / gridColumns
    : containerWidth / gridColumns;
  const gridItemBaseHeight = window.innerHeight / gridRows;

  const containerCallback = useCallback((node?: HTMLDivElement) => {
    if (node) {
      setNode(node);
    }
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (node) {
        setContainerWidth(node.getBoundingClientRect().width);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
    // ignore below to prevent overflow after update from breaking layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, widgets]);

  const counterTitles = useMemo(
    () =>
      widgets.reduce(
        (acc, widget) =>
          widget.type === WidgetTypes.counter
            ? {
                ...acc,
                [widget.id]: widget.config.title,
              }
            : acc,
        {} as Record<string, string>
      ),
    [widgets]
  );

  const refreshActions = {
    [WidgetTypes.dataTable]: (id: string) => {
      dispatch({
        type: ActionTypes.RESET_DATA_TABLE,
        payload: id,
      });
    },
    [WidgetTypes.chart]: (id: string) => {
      dispatch({
        type: ActionTypes.RESET_CHART,
        payload: id,
      });
    },
    [WidgetTypes.counter]: (id: string) => {
      dispatch({
        type: ActionTypes.RESET_COUNTER,
        payload: id,
      });
    },
  };

  return (
    <div
      data-testid="widget-grid"
      className="grid"
      ref={containerCallback as any}
    >
      {widgets.map((widget: WidgetContainerProps) => {
        return (
          <WidgetContainer
            key={widget.id}
            id={widget.id}
            type={widget.type}
            position={widget.position}
            config={widget.config}
            width={gridItemBaseWidth * widget.position.width}
            height={gridItemBaseHeight * widget.position.height}
          >
            <div className="content-container">
              <WidgetHeader
                onRefresh={() => refreshActions[widget.type](widget.id)}
                onRemove={() => {
                  dispatch({
                    type: ActionTypes.REMOVE_WIDGET,
                    payload: widget.id,
                  });
                  //   removeCounterFromPieCounters(widget.id);
                }}
                title={widget.config.title}
              />
              <WidgetContent
                widget={widget}
                counterTitles={counterTitles}
                gridItemBaseWidth={gridItemBaseWidth}
                gridItemBaseHeight={gridItemBaseHeight}
              />
            </div>
          </WidgetContainer>
        );
      })}
      <CreateNewWidget
        gridItemBaseWidth={gridItemBaseWidth}
        gridItemBaseHeight={gridItemBaseHeight}
        newIndex={widgets[widgets.length - 1]?.position.index + 1 || 0}
        createNewCounter={(id: string) =>
          dispatch({
            type: ActionTypes.SET_COUNTER,
            payload: {
              counterId: id,
              value: 0,
            },
          })
        }
      />
    </div>
  );
};
