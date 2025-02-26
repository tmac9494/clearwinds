import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActionTypes,
  useWidgetContext,
  useWidgetContextDispatch,
} from "../../hooks/useWidgetContext/";
import { WidgetContainer, WidgetTypes } from "../widget-container/";
import { PieChart } from "../PieChart";
import { mockPieChartData } from "../PieChart/utils";
import { Counter } from "../counter";
import { DataTable } from "../data-table";
import { CreateNewWidget } from "../create-new-widget";
import { WidgetHeader } from "../widget-header";
import "./styles.scss";

export const WidgetGrid = () => {
  const widgets = useWidgetContext();
  const dispatch = useWidgetContextDispatch();

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [node, setNode] = useState<HTMLDivElement>();

  const widgetsInOrder = Object.values(widgets).sort(
    (a: any, b: any) => a.position.index - b.position.index
  );

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

  return (
    <div className="grid" ref={containerCallback as any}>
      {widgetsInOrder.map((widget: any) => {
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
                <div className="widget-chart-container">
                  <PieChart
                    margin={{ top: 2, bottom: 32 }}
                    width={gridItemBaseWidth * widget.position.width}
                    height={gridItemBaseHeight * widget.position.height}
                    data={mockPieChartData}
                    getId={(data) => data.id}
                    getValue={(data) => data.value}
                  />
                </div>
              )}
              {widget.type === WidgetTypes.counter && <Counter />}
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
        newIndex={
          widgetsInOrder[widgetsInOrder.length - 1]?.position.index + 1 || 0
        }
      />
    </div>
  );
};
