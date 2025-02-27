import React from "react";
import "./styles.scss";

export const Counter = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div data-testid="counter-widget" className="counter">
      <div className="counter-controls">
        <button
          data-testid="counter-decrement"
          className="counter-button counter-decrement"
          onClick={() => value > 0 && onChange(value - 1)}
        >
          -
        </button>
        <div className="counter-value">{value}</div>
        <button
          data-testid="counter-increment"
          className="counter-button counter-increment"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};
