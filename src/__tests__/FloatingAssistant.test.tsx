import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider } from "../context/AppStateContext";
import { FloatingAssistant } from "../components/chat/FloatingAssistant";

describe("FloatingAssistant Widget", () => {
  it("renders assistant toggle action button correctly", () => {
    render(
      <AppStateProvider>
        <FloatingAssistant />
      </AppStateProvider>
    );

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });
});
