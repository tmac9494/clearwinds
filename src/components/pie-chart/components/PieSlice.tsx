import React from "react";
import { useTransition, animated, interpolate } from "react-spring";
import { ProvidedProps, PieArcDatum } from "@visx/shape/lib/shapes/Pie";

type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});
type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
  getLabel?: (d: PieArcDatum<Datum>) => string | undefined;
  textColor?: string;
};

export const PieSlice = <DataType,>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
  getLabel,
  textColor,
}: AnimatedPieProps<DataType>) => {
  const transitions = useTransition<PieArcDatum<DataType>, AnimatedStyles>(
    arcs,
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
      keys: getKey,
    }
  );

  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          strokeWidth={2}
          stroke="#fff"
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity } as any}>
            <text
              fill={textColor ?? "#000"}
              x={centroidX * 2.35}
              y={centroidY * 2.35}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {(getLabel && getLabel(arc)) ?? getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
};
