import React from "react";
import "./styles.scss";

export const Counter = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="counter">
      <div className="counter-value">{count}</div>
      <div className="counter-controls">
        <button
          className="counter-button"
          onClick={() => count > 0 && setCount(count - 1)}
        >
          -
        </button>
        <button className="counter-button" onClick={() => setCount(count + 1)}>
          +
        </button>
      </div>
    </div>
  );
};
