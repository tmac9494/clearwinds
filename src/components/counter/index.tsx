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
    <div className="counter">
      <div className="counter-value">{value}</div>
      <div className="counter-controls">
        <button
          data-testid="counter-decrement"
          className="counter-button"
          onClick={() => value > 0 && onChange(value - 1)}
        >
          -
        </button>
        <button
          data-testid="counter-increment"
          className="counter-button"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};
