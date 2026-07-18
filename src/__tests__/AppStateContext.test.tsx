import React from "react";
import { render, screen } from "@testing-library/react";
import { AppStateProvider, useAppState } from "../context/AppStateContext";

const ContextInspector: React.FC = () => {
  const { userRole, userName, isLoggedIn } = useAppState();
  return (
    <div>
      <span data-testid="user-role">{userRole}</span>
      <span data-testid="user-name">{userName || "unknown"}</span>
      <span data-testid="user-logged">{isLoggedIn ? "yes" : "no"}</span>
    </div>
  );
};

describe("AppStateContext State Machine", () => {
  it("initializes state providers with defaults", () => {
    render(
      <AppStateProvider>
        <ContextInspector />
      </AppStateProvider>
    );

    expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
    expect(screen.getByTestId("user-logged")).toHaveTextContent("yes");
  });
});
