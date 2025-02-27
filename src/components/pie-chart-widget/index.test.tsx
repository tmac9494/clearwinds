import React from "react";
import { render, screen } from "@testing-library/react";

import { PieChartWidget } from ".";
import { WidgetContainerProps } from "../../utils/types";

describe("PieChartWidget", () => {
  const props = {
    widget: {
      id: "test-widget",
      type: "chart",
      position: {
        index: 0,
        width: 100,
        height: 100,
      },
    } as WidgetContainerProps,
    gridItemBaseHeight: 100,
    gridItemBaseWidth: 100,
    counterData: [{ id: "test", value: 1 }],
    counterTitles: {
      test: "Test Counter",
    },
  };

  it("should render the pie chart widget", () => {
    render(<PieChartWidget {...props} />);
    expect(screen.getByTestId("chart-widget")).toBeInTheDocument();
  });

  it("should render the label for the corresponding counter", () => {
    render(<PieChartWidget {...props} />);
    expect(screen.getByText("Test Counter")).toBeInTheDocument();
  });
});
