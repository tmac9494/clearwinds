import React, { useState } from "react";
import { render, screen } from "@testing-library/react";

import { Counter } from "./components/counter";
import { DataTable } from "./components/data-table";
import { PieChart } from "./components/pie-chart";
import { mockPieChartData } from "./components/pie-chart/utils";
import { WidgetStateHandler } from "./hooks/use-widget-context/reducer";
import {
  ActionTypes,
  WidgetContextState,
} from "./hooks/use-widget-context/types";

describe("Widgets", () => {
  describe("Counter", () => {
    const CounterTestComponent = () => {
      const [count, setCount] = useState(0);
      return (
        <Counter value={count} onChange={(value: number) => setCount(value)} />
      );
    };

    it("should render the counter", () => {
      render(<CounterTestComponent />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should increment the counter", () => {
      render(<CounterTestComponent />);
      const incrementButton = screen.getByText("+");
      incrementButton.click();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should decrement the counter", () => {
      render(<CounterTestComponent />);
      const decrementButton = screen.getByText("-");
      decrementButton.click();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should not decrement the counter below 0", () => {
      render(<CounterTestComponent />);
      const decrementButton = screen.getByText("-");
      decrementButton.click();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("DataTable", () => {
    it("should render the loading state", () => {
      render(<DataTable />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should call the fetch api and returns a list of random users", async () => {
      render(<DataTable />);
      const response = await screen.findByText("Antonette");
      expect(response).toBeInTheDocument();
    });
  });

  describe("PieChart", () => {
    const renderPiechart = () =>
      render(
        <PieChart
          data={mockPieChartData}
          title="test chart"
          width={200}
          height={200}
          getId={(data) => data.id}
          getValue={(data) => data.value}
        />
      );
    it("should render the pie chart", () => {
      renderPiechart();
      expect(screen.getByText("test chart")).toBeInTheDocument();
    });
    it("should render the pie chart labels", () => {
      renderPiechart();
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("b")).toBeInTheDocument();
      expect(screen.getByText("c")).toBeInTheDocument();
    });
  });
});

describe("Widget Context State Handler", () => {
  const initialState = {
    counter: {
      id: "counter",
      type: "counter",
      position: { width: 1, height: 1, index: 0 },
    },
    "data-table": {
      id: "data-table",
      type: "data-table",
      position: { width: 1, height: 1, index: 1 },
    },
    "pie-chart": {
      id: "pie-chart",
      type: "pie-chart",
      position: { width: 1, height: 1, index: 2 },
    },
  } as unknown as WidgetContextState;
  const stateHandler = new WidgetStateHandler(initialState);

  it("should return the initial state", () => {
    expect(stateHandler.getState()).toEqual(initialState);
  });

  it("should swap the index position on SWAP_WIDGET action", () => {
    stateHandler["SWAP_WIDGETS"]({
      type: ActionTypes.SWAP_WIDGETS,
      payload: { source: "counter", destination: "data-table" },
    });
    const newState = stateHandler.getState();
    expect(newState.counter.position.index).toEqual(
      initialState["data-table"].position.index
    );
    expect(newState["data-table"].position.index).toEqual(
      initialState.counter.position.index
    );
  });

  it("should remove the widget on REMOVE_WIDGET action", () => {
    stateHandler["REMOVE_WIDGET"]({
      type: ActionTypes.REMOVE_WIDGET,
      payload: "counter",
    });
    const newState = stateHandler.getState();
    expect(newState.counter).toEqual(undefined);
  });

  it("should add the widget on ADD_WIDGET action", () => {
    stateHandler["ADD_WIDGET"]({
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id: "new-widget",
        type: "counter",
        position: { width: 1, height: 1, index: 3 },
      },
    });
    const newState = stateHandler.getState();
    expect(newState["new-widget"]).toBeDefined();
  });
});
