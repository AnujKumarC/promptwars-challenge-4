import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../components/ui/Button";

describe("Button Component", () => {
  it("renders children text content correctly", () => {
    render(<Button>Verify Dispatch</Button>);
    expect(screen.getByText("Verify Dispatch")).toBeInTheDocument();
  });

  it("fires onClick callback function when clicked", () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock}>Verify Dispatch</Button>);
    fireEvent.click(screen.getByText("Verify Dispatch"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
