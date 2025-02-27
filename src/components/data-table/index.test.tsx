import React from "react";
import { render, screen } from "@testing-library/react";
import { DataTable } from ".";

describe("DataTable", () => {
  it("should render the loading state", () => {
    render(<DataTable widget={{} as any} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should call the fetch api and returns a list of random users", async () => {
    render(<DataTable widget={{} as any} />);
    const response = await screen.findByText("Antonette");
    expect(response).toBeInTheDocument();
  });
});
