import React from "react";
import "./styles.scss";
export const WidgetHeader = ({
  onRemove,
  title,
}: {
  onRemove: () => void;
  title: string;
}) => {
  return (
    <div className="widget-header">
      <h4 className="widget-title">{title}</h4>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
};
