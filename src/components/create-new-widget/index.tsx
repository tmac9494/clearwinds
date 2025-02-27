import React from "react";
import { WidgetContainer } from "../widget-container";
import { WidgetForm } from "../widget-form";

import "./styles.scss";
import { WidgetTypes } from "../../utils/types";

export const CreateNewWidget = ({
  gridItemBaseWidth,
  gridItemBaseHeight,
  newIndex,
  createNewCounter,
}: {
  gridItemBaseWidth: number;
  gridItemBaseHeight: number;
  newIndex: number;
  createNewCounter: (id: string) => void;
}) => {
  return (
    <WidgetContainer
      data-testid="new-widget"
      type={"new-widget" as WidgetTypes}
      key="widget-input"
      id="widget-input"
      width={gridItemBaseWidth}
      height={gridItemBaseHeight * 2}
      position={{
        width: 1,
        height: 1,
        index: newIndex,
      }}
      config={{
        title: "Add New Widget",
      }}
      draggable={false}
      animatable={false}
    >
      <div className="content-container new-widget">
        <WidgetForm newIndex={newIndex} createNewCounter={createNewCounter} />
      </div>
    </WidgetContainer>
  );
};
