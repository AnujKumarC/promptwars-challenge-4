import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { AdminView } from "../components/dashboard/AdminView";

describe("AdminView Component", () => {
  it("renders Admin Command Center statistics and map", () => {
    render(
      <AppStateProvider>
        <AdminView />
      </AppStateProvider>
    );
    expect(screen.getByText("Total Capacity")).toBeInTheDocument();
  });
});
