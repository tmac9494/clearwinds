import React from "react";
import { Counter } from "../counter";
import { DataTable } from "../data-table";
import { PieChartWidget } from "../pie-chart-widget";
import { WidgetContainerProps } from "../widget-container";
import {
  ActionTypes,
  useCounters,
  usePieCounters,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context";
import { WidgetTypes } from "../../utils/types";

export const WidgetContent = ({
  widget,
  counterTitles,
  gridItemBaseWidth,
  gridItemBaseHeight,
}: {
  widget: WidgetContainerProps;
  counterTitles: Record<string, string>;
  gridItemBaseWidth: number;
  gridItemBaseHeight: number;
}) => {
  const contextDispatch = useWidgetContextDispatch();
  const pieCounterState = usePieCounters();
  const counters = useCounters();

  switch (widget.type) {
    case WidgetTypes.counter:
      return (
        <Counter
          value={counters[widget.id]}
          onChange={(value: number) => {
            contextDispatch({
              type: ActionTypes.SET_COUNTER,
              payload: {
                counterId: widget.id,
                value,
              },
            });
          }}
        />
      );
    case WidgetTypes.dataTable:
      return (
        <DataTable widget={widget} refetchInterval={widget?.refetchInterval} />
      );
    case WidgetTypes.chart:
      return (
        <PieChartWidget
          counterTitles={counterTitles}
          widget={widget}
          gridItemBaseWidth={gridItemBaseWidth - 24}
          gridItemBaseHeight={gridItemBaseHeight}
          counterData={(pieCounterState[widget.id] || []).reduce(
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
      );
    default:
      return null;
  }
};
