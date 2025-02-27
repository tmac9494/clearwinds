import React from "react";
import { render, screen } from "@testing-library/react";
import {
  WidgetContextProvider,
  useWidgetContext,
  useWidgetContextDispatch,
  usePieCounters,
  useCounters,
  useWidgets,
} from ".";

describe("useWidgetContext", () => {
  const TestComponent = () => {
    const context = useWidgetContext();
    const dispatch = useWidgetContextDispatch();
    const counters = useCounters();
    const pieCounters = usePieCounters();
    const widgets = useWidgets();

    return (
      <div>
        <div data-testid="context">{JSON.stringify(context)}</div>
        <div data-testid="dispatch">{JSON.stringify(dispatch)}</div>
        <div data-testid="counters">{JSON.stringify(counters)}</div>
        <div data-testid="pie-counters">{JSON.stringify(pieCounters)}</div>
        <div data-testid="widgets">{JSON.stringify(widgets)}</div>
      </div>
    );
  };

  it("should provide the widget context values", () => {
    render(
      <WidgetContextProvider>
        <TestComponent />
      </WidgetContextProvider>
    );

    expect(screen.getByTestId("context")).toBeInTheDocument();
    expect(screen.getByTestId("dispatch")).toBeInTheDocument();
    expect(screen.getByTestId("counters")).toBeInTheDocument();
    expect(screen.getByTestId("pie-counters")).toBeInTheDocument();
    expect(screen.getByTestId("widgets")).toBeInTheDocument();
  });
});
