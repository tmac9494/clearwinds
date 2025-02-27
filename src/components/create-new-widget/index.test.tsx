import React from "react";
import { render, screen } from "@testing-library/react";

import { CreateNewWidget } from ".";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("CreateNewWidget", () => {
  const renderComponent = () =>
    render(
      <DndProvider backend={HTML5Backend}>
        <CreateNewWidget
          newIndex={1}
          gridItemBaseWidth={1}
          gridItemBaseHeight={1}
          createNewCounter={() => {}}
        />
      </DndProvider>
    );

  it("should render the create new widget component", () => {
    renderComponent();
    expect(screen.getByTestId("new-widget")).toBeInTheDocument();
  });
});
