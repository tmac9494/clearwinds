import React from "react";
import { render, screen } from "@testing-library/react";

import { WidgetFormInput } from ".";

describe("WidgetFormInput", () => {
  const renderComponent = () =>
    render(
      <WidgetFormInput label="Test Label">
        <input type="text" />
      </WidgetFormInput>
    );

  it("should render the widget form input", () => {
    renderComponent();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should render the children", () => {
    renderComponent();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
