import React, { useState } from "react";
import { Counter } from ".";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Counter", () => {
  const CounterTestComponent = ({ value }: { value?: number }) => {
    const [count, setCount] = useState(value ?? 0);
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
    fireEvent.click(incrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should decrement the counter", () => {
    render(<CounterTestComponent value={2} />);
    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);
    expect(screen.getByText(1)).toBeInTheDocument();
  });

  it("should not decrement the counter below 0", () => {
    render(<CounterTestComponent />);
    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
