import React, { useMemo } from "react";
import "./styles.scss";
import { PieChart } from "../pie-chart";
import { mockPieChartData } from "../pie-chart/utils";
import { WidgetContainerProps } from "../widget-container";

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
    setPieCoutners({
      ...pieCounters,
      [widget.id]: [...(pieCounters[widget.id] || []), newCounter],
    });
  };

  const counterOptions = useMemo(
    () =>
      Object.keys(counters).filter((key) =>
        pieCounters ? !pieCounters[widget.id]?.find((d) => d === key) : true
      ),
    [pieCounters, widget.id, counters]
  );

  return (
    <div className="widget-chart-container">
      <button className="open" onClick={() => setModal(!modal)}>
        options
      </button>
      <PieChart<(typeof dataset)[0]>
        margin={{ top: 2, bottom: 32 }}
        width={gridItemBaseWidth * widget.position.width}
        height={gridItemBaseHeight * widget.position.height}
        data={dataset}
        getLabel={(data) => counterTitles[data?.data.id]}
        getId={(data) => data.id}
        getValue={(data) => data.value}
      />
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <select onChange={(e) => handleSetPieCounters(e.target.value)}>
              <option value="">Select a counter</option>
              {counterOptions.map((key) => (
                <option key={key} value={key}>
                  {counterTitles[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
