import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { MedicalView } from "../components/dashboard/MedicalView";

describe("MedicalView Component", () => {
  it("renders Medical Triage dispatch layouts", () => {
    render(
      <AppStateProvider>
        <MedicalView />
      </AppStateProvider>
    );
    expect(screen.getByText("Live Trauma Ambulance telemetry")).toBeInTheDocument();
  });
});
