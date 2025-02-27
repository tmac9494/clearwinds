import React from "react";
import { render, screen } from "@testing-library/react";
import { DataTable } from ".";

describe("DataTable", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should render the loading state", () => {
    render(<DataTable widget={{} as any} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should call the fetch api and returns a list of random users", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "Success",
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: "Leanne Graham",
              username: "Bret",
              address: {
                zipcode: "92998-3874",
              },
            },
          ]),
      })
    ) as jest.Mock;
    render(<DataTable widget={{} as any} />);
    const response = await screen.findByText("Leanne Graham");
    expect(response).toBeInTheDocument();
  });

  it("should render the error state", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Internal Server Error",
      })
    ) as jest.Mock;

    render(<DataTable widget={{} as any} />);
    const response = await screen.findByText("Error loading data");
    expect(response).toBeInTheDocument();
  });

  it("should show loading state when fetch is loading", async () => {
    global.fetch = jest.fn(() => Promise) as jest.Mock;
    render(<DataTable widget={{} as any} />);
    const response = await screen.findByText("Loading...");
    expect(response).toBeInTheDocument();
  });
});
