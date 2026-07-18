import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { InteractiveMap } from "../components/map/InteractiveMap";

describe("InteractiveMap Component", () => {
  it("renders stadium stands layout text indicators", () => {
    render(
      <AppStateProvider>
        <InteractiveMap />
      </AppStateProvider>
    );

    expect(screen.getByText("NORTH STAND")).toBeInTheDocument();
    expect(screen.getByText("SOUTH STAND")).toBeInTheDocument();
  });
});
