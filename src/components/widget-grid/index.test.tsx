import React from "react";
import { render, screen } from "@testing-library/react";
import { WidgetGrid } from ".";

import { WidgetContextProvider } from "../../hooks/use-widget-context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("WidgetGrid", () => {
  const renderComponent = () =>
    render(
      <WidgetContextProvider>
        <DndProvider backend={HTML5Backend}>
          <WidgetGrid />
        </DndProvider>
      </WidgetContextProvider>
    );

  it("should render the component", () => {
    renderComponent();
    expect(screen.getByTestId("widget-grid")).toBeInTheDocument();
  });

  it("should render the widget form", () => {
    renderComponent();
    expect(screen.getByTestId("widget-form")).toBeInTheDocument();
  });

  it("should render widgets from context from localStorage", () => {
    localStorage.setItem(
      "widgets",
      JSON.stringify({
        widgets: [
          {
            id: "test-widget",
            type: "chart",
            position: {
              index: 0,
              width: 1,
              height: 1,
            },
            config: {
              title: "Test Widget",
            },
          },
          {
            id: "test-widget-2",
            type: "dataTable",
            position: {
              index: 1,
              width: 1,
              height: 1,
            },
            config: {
              title: "Test Widget 2",
            },
          },
          {
            id: "test-widget-3",
            type: "counter",
            position: {
              index: 2,
              width: 1,
              height: 1,
            },
            config: {
              title: "Test Widget 3",
            },
          },
        ],
        counters: {
          test: {
            id: "test",
            value: 1,
          },
        },
        pieCounters: {
          "test-widget": ["test-widget-3"],
        },
      })
    );
    renderComponent();
    expect(screen.getByTestId("chart-widget")).toBeInTheDocument();
    expect(screen.getByTestId("data-table-widget")).toBeInTheDocument();
    expect(screen.getByTestId("counter-widget")).toBeInTheDocument();
    expect(screen.getByTestId("new-widget")).toBeInTheDocument();
  });
});
