import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Settings from "../containers/Settings";

const defaultProps = {
  speedNames: ["Slow", "Fast"],
  speedIndex: 0,
  setSpeed: () => {},
  setMode: () => {},
  displaySettings: {
    showKnight: true,
    showCount: true,
    showPercent: false,
    showHeatmap: false,
    showHighlight: true,
  },
  toggleDisplaySettings: () => {},
  initialTotalFiles: 8,
  initialTotalRanks: 8,
  changeDimensions: () => {},
  isManual: false,
};

describe("The Settings component", () => {
  // imperatively changing props; user-directed behaviour tested in Main
  it("allows the user to toggle the visibility of the knight", () => {
    const spy = jest.fn();
    const { rerender } = render(
      <Settings {...defaultProps} toggleDisplaySettings={spy} />
    );
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Knight")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Knight"));
    expect(spy).toHaveBeenCalledWith("showKnight");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showKnight: false,
    });
    rerender(
      <Settings {...defaultProps} displaySettings={newDisplaySettings} />
    );
    expect(screen.getByLabelText("Knight")).not.toBeChecked();
  });

  it("allows the user to toggle the visibility of each square count", () => {
    const spy = jest.fn();
    const { rerender } = render(
      <Settings {...defaultProps} toggleDisplaySettings={spy} />
    );
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Count")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Count"));
    expect(spy).toHaveBeenCalledWith("showCount");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showCount: false,
    });
    rerender(
      <Settings {...defaultProps} displaySettings={newDisplaySettings} />
    );
    expect(screen.getByLabelText("Count")).not.toBeChecked();
  });

  it("allows the user to toggle the visibility of the percent of max", () => {
    const spy = jest.fn();
    const { rerender } = render(
      <Settings {...defaultProps} toggleDisplaySettings={spy} />
    );
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("% of max")).not.toBeChecked();
    fireEvent.click(screen.getByLabelText("% of max"));
    expect(spy).toHaveBeenCalledWith("showPercent");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showPercent: true,
    });
    rerender(
      <Settings {...defaultProps} displaySettings={newDisplaySettings} />
    );
    expect(screen.getByLabelText("% of max")).toBeChecked();
  });

  it("allows the user to toggle the visibility of the heatmap", () => {
    const spy = jest.fn();
    const { rerender } = render(
      <Settings {...defaultProps} toggleDisplaySettings={spy} />
    );
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Heatmap")).not.toBeChecked();
    fireEvent.click(screen.getByLabelText("Heatmap"));
    expect(spy).toHaveBeenCalledWith("showHeatmap");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showHeatmap: true,
    });
    rerender(
      <Settings {...defaultProps} displaySettings={newDisplaySettings} />
    );
    expect(screen.getByLabelText("Heatmap")).toBeChecked();
  });

  it("allows the user to toggle the visibility of highlighted squares", () => {
    const spy = jest.fn();
    const { rerender } = render(
      <Settings {...defaultProps} toggleDisplaySettings={spy} />
    );
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Highlight")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Highlight"));
    expect(spy).toHaveBeenCalledWith("showHighlight");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showHighlight: false,
    });
    rerender(
      <Settings {...defaultProps} displaySettings={newDisplaySettings} />
    );
    expect(screen.getByLabelText("Highlight")).not.toBeChecked();
  });

  it("toggles between automatic and manual mode", () => {
    const spy = jest.fn();
    const { rerender } = render(<Settings {...defaultProps} setMode={spy} />);
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
    userEvent.click(screen.getByLabelText("Manual"));
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].target.value).toBe("manual");
    rerender(<Settings {...defaultProps} setMode={spy} isManual={true} />);
    expect(screen.getByLabelText("Automatic")).not.toBeChecked();
    expect(screen.getByLabelText("Manual")).toBeChecked();
    userEvent.click(screen.getByLabelText("Automatic"));
    rerender(<Settings {...defaultProps} setMode={spy} isManual={false} />);
    expect(spy.mock.calls[1][0].target.value).toBe("auto");
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
  });
});
