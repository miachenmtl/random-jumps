import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

describe("The App root", () => {
  it("renders app title", () => {
    render(<App />);
    const titleEl = screen.getByText(/Random Knight Jumps/i);
    expect(titleEl).toBeInTheDocument();
  });

  it("allows the user to switch from English to français", () => {
    render(<App />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Automatic")).toBeInTheDocument();

    userEvent.click(screen.getByText("Français"));
    expect(screen.queryByText("Start")).toBeNull();
    expect(screen.getByText("Marche")).toBeInTheDocument();
    expect(screen.getByText("Automatique")).toBeInTheDocument();
  });
});
