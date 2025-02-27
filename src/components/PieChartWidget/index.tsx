import React, { useMemo } from "react";
import "./styles.scss";
import { PieChart } from "../pie-chart";
import {
  defaultPieChartColorRange,
  mockPieChartData,
} from "../pie-chart/utils";
import { WidgetContainerProps } from "../widget-container";
import classNames from "classnames";
import {
  ActionTypes,
  useCounters,
  usePieCounters,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context";
import { scaleOrdinal } from "@visx/scale";
import { getContrastColor } from "../../utils";

export const PieChartWidget = ({
  widget,
  gridItemBaseWidth,
  gridItemBaseHeight,
  counterData,
  counterTitles,
}: {
  widget: WidgetContainerProps;
  gridItemBaseWidth: number;
  gridItemBaseHeight: number;
  counterData: {
    id: string;
    value: number;
  }[];
  counterTitles: Record<string, string>;
}) => {
  const contextDispatch = useWidgetContextDispatch();
  const pieCounters = usePieCounters();
  const counters = useCounters();

  const [modal, setModal] = React.useState(false);

  const dataset = !!counterData?.length ? counterData : mockPieChartData;

  const handleSetPieCounters = (newCounter: string) => {
    const action = pieCounters?.[widget.id]?.includes(newCounter)
      ? ActionTypes.REMOVE_COUNTER_FROM_CHART
      : ActionTypes.ADD_COUNTER_TO_CHART;

    contextDispatch({
      type: action,
      payload: {
        chartId: widget.id,
        counterId: newCounter,
      },
    });
  };

  const counterOptions = useMemo(
    () => Object.keys(counters).filter((key) => !!counterTitles[key]),
    [counters, counterTitles]
  );

  const chartWidth = gridItemBaseWidth * widget.position.width;

  const getDataColor = scaleOrdinal({
    domain: dataset.map((d) => d.id),
    range: defaultPieChartColorRange,
  });

  return (
    <div className="widget-chart-container" data-testid="chart-widget">
      <div className="modal-container">
        {counterOptions.length > 0 && (
          <button
            data-testid="chart-open-modal"
            className="open"
            onClick={() => setModal(!modal)}
          >
            <span>Options</span>
            <span>&#129171;</span>
          </button>
        )}
        {modal && (
          <div className="modal">
            {counterOptions.map((key) => {
              const backgroundColor = counterData.find((d) => d.id === key)
                ? getDataColor(key)
                : undefined;
              return (
                <button
                  onClick={() => handleSetPieCounters(key)}
                  style={{
                    color: backgroundColor
                      ? getContrastColor(backgroundColor)
                      : "#000",
                    backgroundColor,
                  }}
                  className={classNames(
                    "modal-option",
                    counterData?.find((d) => d.id === key) && "active"
                  )}
                  key={key}
                  value={key}
                >
                  {counterTitles[key]}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="chart-container">
        <PieChart<(typeof dataset)[0]>
          margin={{ top: 2, bottom: 40, left: 0, right: 0 }}
          width={chartWidth > 300 ? 300 : chartWidth}
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
