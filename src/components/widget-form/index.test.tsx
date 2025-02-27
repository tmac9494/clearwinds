import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WidgetForm } from ".";
import { WidgetContextProvider } from "../../hooks/use-widget-context";

describe("WidgetForm", () => {
  const closeForm = jest.fn();
  const createNewCounter = jest.fn();
  const renderComponent = () =>
    render(
      <WidgetContextProvider>
        <WidgetForm
          closeForm={closeForm}
          newIndex={1}
          createNewCounter={createNewCounter}
        />
      </WidgetContextProvider>
    );

  it("should render the component", () => {
    renderComponent();
    expect(screen.getByTestId("widget-form")).toBeInTheDocument();
  });

  it("should update the title when the input changes", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(titleInput).toHaveValue("New Title");
  });

  it("should update the type input when select changes", () => {
    renderComponent();
    const typeSelect = screen.getByTestId("form-type-input");
    fireEvent.change(typeSelect, { target: { value: "chart" } });
    expect(typeSelect).toHaveValue("chart");
  });

  it("should update the refetch interval when the input changes", () => {
    renderComponent();
    const typeSelect = screen.getByTestId("form-type-input");
    fireEvent.change(typeSelect, { target: { value: "dataTable" } });
    const refetchIntervalInput = screen.getByTestId("form-refetch-input");
    fireEvent.change(refetchIntervalInput, { target: { value: "10" } });
    expect(refetchIntervalInput).toHaveValue(10);
  });

  it("should update the width when the input changes", () => {
    renderComponent();
    const widthInput = screen.getByTestId("form-width-input");
    fireEvent.change(widthInput, { target: { value: "2" } });
    expect(widthInput).toHaveValue(2);
  });

  it("should update the height when the input changes", () => {
    renderComponent();
    const heightInput = screen.getByTestId("form-height-input");
    fireEvent.change(heightInput, { target: { value: "2" } });
    expect(heightInput).toHaveValue(2);
  });

  it("should clear the form after submit", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Title");
    const typeSelect = screen.getByTestId("form-type-input");
    const widthInput = screen.getByTestId("form-width-input");
    const heightInput = screen.getByTestId("form-height-input");
    const submitButton = screen.getByTestId("form-submit");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    fireEvent.change(typeSelect, { target: { value: "dataTable" } });
    fireEvent.change(widthInput, { target: { value: "2" } });
    fireEvent.change(heightInput, { target: { value: "2" } });
    fireEvent.click(submitButton);
    expect(titleInput).toHaveValue("");
    expect(typeSelect).toHaveValue("");
    expect(widthInput).toHaveValue(1);
    expect(heightInput).toHaveValue(1);
  });
});
