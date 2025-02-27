import React from "react";
import { render, screen } from "@testing-library/react";

import { CreateNewWidget } from ".";

describe.skip("CreateNewWidget", () => {
  // skip below due to dnd import error
  it.skip("should render the create new widget component", () => {
    render(
      <CreateNewWidget
        newIndex={1}
        gridItemBaseWidth={1}
        gridItemBaseHeight={1}
        createNewCounter={() => {}}
      />
    );
    expect(screen.getByTestId("new-widget")).toBeInTheDocument();
  });
});
