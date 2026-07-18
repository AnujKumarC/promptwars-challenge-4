import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { VolunteerView } from "../components/dashboard/VolunteerView";

describe("VolunteerView Component", () => {
  it("renders Volunteer Shift and Check-In information", () => {
    render(
      <AppStateProvider>
        <VolunteerView />
      </AppStateProvider>
    );
    expect(screen.getByText("Assigned Operations Checklist")).toBeInTheDocument();
  });
});
