import { waitFor, render, screen, fireEvent, act } from "@testing-library/react";
import { EOL } from "os";
import Stats from "../containers/Stats";
import LangContext from "../LangContext";
const mockVisitCounts = [[1, 2, 4, 5], [4, 3, 5, 2], [2, 3, 5, 6], [1, 4, 6, 4]];
const mockContext = {
  lang: "en",
  setLang: () => {}
}; // simplified from https://testing-library.com/docs/example-react-context/

const renderWithLang = ui => {
  return render( /*#__PURE__*/React.createElement(LangContext.Provider, {
    value: mockContext
  }, ui));
};

describe("The stats container", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    renderWithLang( /*#__PURE__*/React.createElement(Stats, {
      stats: {
        totalMoves: 345,
        countsForReturn: [2, 54, 34],
        countsForTour: [235]
      },
      visitCounts: mockVisitCounts
    }));
  });
  afterEach(() => {
    // the docs recomment jest.runOnlyPendingTimers + jest.useRealTimers
    // but it doesn't work. this does.
    // see https://testing-library.com/docs/using-fake-timers/
    jest.clearAllTimers();
  });
  it("copies the provided visit counts as a csv to the clipboard", async () => {
    expect(global.navigator.clipboard.writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Copy board as CSV"));
    await waitFor(() => {
      expect(screen.getAllByText("Copied!")).toHaveLength(1);
    });
    expect(global.navigator.clipboard.writeText).toHaveBeenCalled();
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(`1,4,6,4${EOL}2,3,5,6${EOL}4,3,5,2${EOL}1,2,4,5${EOL}`);
  });
  it("reverts the button text after a second", async () => {
    fireEvent.click(screen.getByText("Copy board as CSV"));
    expect(screen.getByText("Copy board as CSV")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(await screen.findAllByText("Copied!")).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getAllByText("Copy board as CSV")).toHaveLength(1);
    });
  });
  it("shows and hides the copy button and message when the mouse moves", () => {
    expect(document.querySelectorAll(".show")).toHaveLength(0);
    fireEvent.mouseEnter(document.querySelector(".textarea-wrapper"));
    expect(document.querySelectorAll(".show")).toHaveLength(2);
    fireEvent.mouseLeave(document.querySelector(".textarea-wrapper"));
    expect(document.querySelectorAll(".show")).toHaveLength(0);
  });
  it("copies the provided return counts as a column to the clipboard", async () => {
    expect(global.navigator.clipboard.writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByText("Copy")[0]);
    await waitFor(() => {
      expect(screen.getAllByText("Copied!")).toHaveLength(1);
    });
    expect(global.navigator.clipboard.writeText).toHaveBeenCalled();
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(`2${EOL}54${EOL}34${EOL}`);
  });
  it("reverts the section button text after a second", async () => {
    fireEvent.click(screen.getAllByText("Copy")[0]);
    expect(screen.getAllByText("Copy")[0]).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(await screen.findAllByText("Copied!")).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getAllByText("Copy")).toHaveLength(2);
    });
  });
});