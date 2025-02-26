import React, { PropsWithChildren } from "react";
import "./styles.scss";

export const WidgetFormInput = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => {
  return (
    <div className="widget-form-input">
      <label>{label}</label>
      {children}
    </div>
  );
};
