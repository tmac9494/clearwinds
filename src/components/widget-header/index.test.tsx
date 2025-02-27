import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { WidgetHeader } from ".";

describe("WidgetHeader", () => {
  const removeFunction = jest.fn();
  const refreshFunction = jest.fn();
  const renderComponent = () =>
    render(
      <WidgetHeader
        onRefresh={refreshFunction}
        onRemove={removeFunction}
        title="Test Title"
      />
    );

  it("should render the widget header", () => {
    renderComponent();
    expect(screen.getByTestId("widget-header")).toBeInTheDocument();
  });

  it("should render the title", () => {
    renderComponent();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should call the remove function when the button is clicked", () => {
    renderComponent();
    const removeButton = screen.getByTestId("remove-widget");
    fireEvent.click(removeButton);
    expect(removeFunction).toHaveBeenCalled();
  });

  it("should call the refresh function when the button is clicked", () => {
    renderComponent();
    const refreshButton = screen.getByTestId("refresh-widget");
    fireEvent.click(refreshButton);
    expect(refreshFunction).toHaveBeenCalled();
  });
});
