import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { SecurityView } from "../components/dashboard/SecurityView";

describe("SecurityView Component", () => {
  it("renders Security CCTV feed scanner modules", () => {
    render(
      <AppStateProvider>
        <SecurityView />
      </AppStateProvider>
    );
    expect(screen.getByText("Security CCTV Scanner Grid")).toBeInTheDocument();
  });
});
