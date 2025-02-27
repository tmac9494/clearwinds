import React from "react";
import { render, screen } from "@testing-library/react";

import { WidgetContent } from ".";
import { WidgetContainerProps } from "../../utils/types";
import { WidgetTypes } from "../../utils/types";

describe("WidgetContent", () => {
  const renderComponent = ({
    widget,
  }: {
    widget?: Partial<WidgetContainerProps>;
  }) =>
    render(
      <WidgetContent
        widget={
          {
            ...widget,
            id: "test-widget",
          } as WidgetContainerProps
        }
        counterTitles={{}}
        gridItemBaseWidth={100}
        gridItemBaseHeight={100}
      />
    );

  it("should render the counter widget", () => {
    renderComponent({
      widget: { type: WidgetTypes.counter },
    });
    expect(screen.getByTestId("counter-widget")).toBeInTheDocument();
  });

  it("should render the data table widget", () => {
    renderComponent({ widget: { type: WidgetTypes.dataTable } });
    expect(screen.getByTestId("data-table-widget")).toBeInTheDocument();
  });

  it("should render the pie chart widget", () => {
    renderComponent({
      widget: {
        type: WidgetTypes.chart,
        position: {
          index: 0,
          width: 100,
          height: 100,
        },
      },
    });
    expect(screen.getByTestId("chart-widget")).toBeInTheDocument();
  });

  it("should return null if widget type is not found", () => {
    const { container } = renderComponent({
      widget: { type: "unknown" as WidgetTypes },
    });
    expect(container.innerHTML).toEqual("");
  });
});
