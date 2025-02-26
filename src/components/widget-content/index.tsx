import React from "react";
import { Counter } from "../counter";
import { DataTable } from "../data-table";
import { PieChartWidget } from "../PieChartWidget";
import { WidgetContainerProps, WidgetTypes } from "../widget-container";

export const WidgetContent = ({
  widget,
  counters,
  counterTitles,
  gridItemBaseWidth,
  gridItemBaseHeight,
  pieCounters,
  setPieCoutners,
  setCounters,
}: {
  widget: WidgetContainerProps;
  counters: Record<string, number>;
  counterTitles: Record<string, string>;
  gridItemBaseWidth: number;
  gridItemBaseHeight: number;
  pieCounters: Record<string, string[]>;
  setPieCoutners: (value: Record<string, string[]>) => void;
  setCounters: (value: React.SetStateAction<Record<string, number>>) => void;
}) => {
  if (widget.type === WidgetTypes.chart) {
    return (
      <PieChartWidget
        counterTitles={counterTitles}
        counters={counters}
        widget={widget}
        gridItemBaseWidth={gridItemBaseWidth - 24}
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
    );
  }
  if (widget.type === WidgetTypes.counter) {
    return (
      <Counter
        value={counters[widget.id]}
        onChange={(value: number) => {
          setCounters((prev) => ({
            ...prev,
            [widget.id]: value,
          }));
        }}
      />
    );
  }
  if (widget.type === WidgetTypes.dataTable) {
    return <DataTable refetchInterval={widget?.refetchInterval} />;
  }
  return null;
};
