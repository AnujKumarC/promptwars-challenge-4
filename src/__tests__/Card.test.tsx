import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../components/ui/Card";

describe("Card Component", () => {
  it("renders nested children nodes cleanly inside layouts", () => {
    render(<Card>Interactive Telemetry Data</Card>);
    expect(screen.getByText("Interactive Telemetry Data")).toBeInTheDocument();
  });
});
