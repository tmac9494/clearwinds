import React, { useMemo } from "react";
import "./styles.scss";
import { PieChart } from "../pie-chart";
import { mockPieChartData } from "../pie-chart/utils";
import { WidgetContainerProps } from "../widget-container";
import classNames from "classnames";

export const PieChartWidget = ({
  counters,
  widget,
  gridItemBaseWidth,
  gridItemBaseHeight,
  setPieCoutners,
  counterData,
  pieCounters,
  counterTitles,
}: {
  counters: Record<string, number>;
  widget: WidgetContainerProps;
  gridItemBaseWidth: number;
  gridItemBaseHeight: number;
  pieCounters: Record<string, string[]>;
  setPieCoutners: (data: Record<string, string[]>) => void;
  counterData: {
    id: string;
    value: number;
  }[];
  counterTitles: Record<string, string>;
}) => {
  const [modal, setModal] = React.useState(false);

  const dataset = !!counterData?.length ? counterData : mockPieChartData;

  const handleSetPieCounters = (newCounter: string) => {
    if (pieCounters?.[widget.id]?.includes(newCounter)) {
      setPieCoutners({
        ...pieCounters,
        [widget.id]: pieCounters[widget.id].filter((c) => c !== newCounter),
      });
      return;
    }
    setPieCoutners({
      ...pieCounters,
      [widget.id]: [...(pieCounters[widget.id] || []), newCounter],
    });
  };

  const counterOptions = useMemo(
    () =>
      Object.keys(counters).filter((key) =>
        pieCounters ? counterTitles[key] : true
      ),
    [pieCounters, counters, counterData, counterTitles]
  );

  return (
    <div className="widget-chart-container">
      <div className="modal-container">
        <button className="open" onClick={() => setModal(!modal)}>
          <span>Options</span>
          <span>&#129171;</span>
        </button>
        {modal && (
          <div className="modal">
            {counterOptions.map((key) => (
              <button
                onClick={() => handleSetPieCounters(key)}
                className={classNames(
                  "modal-option",
                  counterData?.find((d) => d.id === key) && "active"
                )}
                key={key}
                value={key}
              >
                {counterTitles[key]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chart-container">
        <PieChart<(typeof dataset)[0]>
          margin={{ top: 2, bottom: 40, left: 0, right: 0 }}
          width={
            gridItemBaseWidth > 400
              ? 400
              : gridItemBaseWidth * widget.position.width
          }
          height={gridItemBaseHeight * widget.position.height}
          data={dataset}
          getLabel={(data) => counterTitles[data?.data.id]}
          getId={(data) => data.id}
          getValue={(data) => data.value}
        />
      </div>
    </div>
  );
};
