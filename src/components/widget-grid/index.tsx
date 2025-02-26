import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActionTypes,
  useWidgetContext,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context/";
import { WidgetContainer, WidgetTypes } from "../widget-container/";
import { Counter } from "../counter";
import { DataTable } from "../data-table";
import { CreateNewWidget } from "../create-new-widget";
import { WidgetHeader } from "../widget-header";
import "./styles.scss";
import { PieChartWidget } from "../PieChartWidget";

export const WidgetGrid = () => {
  const widgets = useWidgetContext();
  const dispatch = useWidgetContextDispatch();
  const initialCounters = widgets.reduce(
    (acc, widget) =>
      widget.type === WidgetTypes.counter
        ? {
            ...acc,
            [widget.id]: 0,
          }
        : acc,
    {}
  );

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [node, setNode] = useState<HTMLDivElement>();
  const [counters, setCounters] =
    useState<Record<string, number>>(initialCounters);
  const [pieCounters, setPieCoutners] = useState<Record<string, string[]>>({});

  const dimensionDenominator =
    containerWidth >= 1000 ? 5 : containerWidth >= 600 ? 3 : 2;
  const gridItemBaseWidth = node
    ? node.getBoundingClientRect().width / dimensionDenominator
    : containerWidth / dimensionDenominator;
  const gridItemBaseHeight = window.innerHeight / dimensionDenominator;

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

  const counterTitles = widgets.reduce(
    (acc, widget) =>
      widget.type === WidgetTypes.counter
        ? {
            ...acc,
            [widget.id]: widget.config.title,
          }
        : acc,
    {} as Record<string, string>
  );

  return (
    <div className="grid" ref={containerCallback as any}>
      {widgets.map((widget: any) => {
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
                onRemove={() =>
                  dispatch({
                    type: ActionTypes.REMOVE_WIDGET,
                    payload: widget.id,
                  })
                }
                title={widget.config.title}
              />
              {widget.type === WidgetTypes.chart && (
                <PieChartWidget
                  counterTitles={counterTitles}
                  counters={counters}
                  widget={widget}
                  gridItemBaseWidth={gridItemBaseWidth}
                  gridItemBaseHeight={gridItemBaseHeight}
                  pieCounters={pieCounters}
                  setPieCoutners={setPieCoutners}
                  counterData={(pieCounters[widget.id] || []).reduce(
                    (acc, val) =>
                      acc.concat([
                        {
                          id: val,
                          value: counters[val] ?? 0,
                        },
                      ]),
                    [] as Array<{
                      id: string;
                      value: number;
                    }>
                  )}
                />
              )}
              {widget.type === WidgetTypes.counter && (
                <Counter
                  value={counters[widget.id]}
                  onChange={(value: number) => {
                    setCounters((prev) => ({
                      ...prev,
                      [widget.id]: value,
                    }));
                  }}
                />
              )}
              {widget.type === WidgetTypes.dataTable && (
                <DataTable refetchInterval={widget?.refetchInterval} />
              )}
            </div>
          </WidgetContainer>
        );
      })}
      <CreateNewWidget
        gridItemBaseWidth={gridItemBaseWidth}
        gridItemBaseHeight={gridItemBaseHeight}
        newIndex={widgets[widgets.length - 1]?.position.index + 1 || 0}
        createNewCounter={(id: string) =>
          setCounters((prev) => ({
            ...prev,
            [id]: 0,
          }))
        }
      />
    </div>
  );
};
