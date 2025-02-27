import React from "react";
import "./styles.scss";
export const WidgetHeader = ({
  onRemove,
  onRefresh,
  title,
}: {
  onRemove: () => void;
  onRefresh: () => void;
  title: string;
}) => {
  return (
    <div data-testid="widget-header" className="widget-header">
      <h4 className="widget-title">{title}</h4>
      <div className="widget-controls">
        <button
          data-testid="refresh-widget"
          onClick={onRefresh}
          className="refresh"
        >
          &#x27F3;
        </button>
        <button
          data-testid="remove-widget"
          className="close"
          onClick={onRemove}
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};
