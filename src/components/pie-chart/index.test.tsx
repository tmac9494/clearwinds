import React from "react";
import { render, screen } from "@testing-library/react";
import { PieChart } from ".";
import { mockPieChartData } from "./utils";

describe("PieChart", () => {
  const renderPiechart = () =>
    render(
      <PieChart
        data={mockPieChartData}
        title="test chart"
        width={200}
        height={200}
        getId={(data) => data.id}
        getValue={(data) => data.value}
      />
    );
  it("should render the pie chart", () => {
    renderPiechart();
    expect(screen.getByText("test chart")).toBeInTheDocument();
  });
  it("should render the pie chart labels", () => {
    renderPiechart();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByText("c")).toBeInTheDocument();
  });
});
