import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { FanView } from "../components/dashboard/FanView";

describe("FanView Component", () => {
  it("renders Fan Portal custom layout and food cards", () => {
    render(
      <AppStateProvider>
        <FanView />
      </AppStateProvider>
    );
    expect(screen.getByText("Food AI Stall Recommendations")).toBeInTheDocument();
  });
});
