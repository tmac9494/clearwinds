import React from "react";
import Pie from "@visx/shape/lib/shapes/Pie";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";
import classNames from "classnames";

import { PieSlice } from "./components";
import "./styles.scss";
import { defaultPieChartColorRange, defaultPieChartMargin } from "./utils";
import { PieChartProps } from "./types";

export const PieChart = <DataType,>({
  data,
  width,
  height,
  margin = defaultPieChartMargin,
  animate = true,
  getId,
  getValue,
  getLabel,
  getColor,
  title,
  textColor,
  className,
  onSelect,
  selection,
}: PieChartProps<DataType>) => {
  const getDataColor = scaleOrdinal({
    domain: data.map((sliceData) => getId(sliceData)),
    range: defaultPieChartColorRange,
  });

  if (width < 10) return null;

  const chartMargin = {
    ...defaultPieChartMargin,
    ...margin,
  };
  const innerWidth = width - chartMargin.left - chartMargin.right;
  const innerHeight = height - chartMargin.top - chartMargin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const svgPadding = 18;

  return (
    <div
      className={classNames("pie-chart-container", className)}
      style={{
        width: innerWidth,
      }}
    >
      <svg width={innerWidth} height={innerHeight}>
        <Group
          top={centerY + chartMargin.top}
          left={centerX + chartMargin.left}
        >
          <Pie
            data={
              selection
                ? data.filter(
                    (sliceData) => getId(sliceData) === getId(selection)
                  )
                : data
            }
            pieValue={getValue}
            pieSortValues={() => -1}
            outerRadius={radius - svgPadding}
          >
            {(pie) => (
              <PieSlice<DataType>
                {...pie}
                textColor={textColor}
                animate={animate}
                getKey={({ data }) => getId(data)}
                onClickDatum={({ data }) =>
                  animate &&
                  onSelect &&
                  onSelect(
                    selection && getId(selection) === getId(data) ? null : data
                  )
                }
                getColor={({ data }) =>
                  (getColor && getColor(data)) ?? getDataColor(getId(data))
                }
                getLabel={getLabel}
              />
            )}
          </Pie>
        </Group>
        {title && (
          <Text
            x={centerX}
            y={centerY - width / 2}
            textAnchor="middle"
            fill={textColor ?? "#000"}
            fontSize={24}
          >
            {title}
          </Text>
        )}
      </svg>
    </div>
  );
};
