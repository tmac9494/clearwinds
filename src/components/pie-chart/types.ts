import { PieArcDatum } from "@visx/shape/lib/shapes/Pie";

import { defaultPieChartMargin } from "./utils";

export type PieChartProps<DataType> = {
  width: number;
  height: number;
  margin?: Partial<typeof defaultPieChartMargin>;
  animate?: boolean;
  data: DataType[];
  getId: (value: DataType) => string;
  getValue: (value: DataType) => number;
  getLabel?: (value: PieArcDatum<DataType>) => string | undefined;
  getColor?: (value: DataType) => string | undefined;
  title?: string;
  textColor?: string;
  className?: string;
  onSelect?: (value: DataType | null) => void;
  selection?: DataType | null;
};
