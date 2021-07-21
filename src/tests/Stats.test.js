import {
  waitFor,
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { EOL } from "os";

import Stats from "../containers/Stats";

const mockVisitCounts = [
  [1, 2, 4, 5],
  [4, 3, 5, 2],
  [2, 3, 5, 6],
  [1, 4, 6, 4],
];

describe("The stats container", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(
      <Stats
        stats={{
          totalMoves: 345,
          countsForReturn: [2, 54, 34],
          countsForTour: [235],
        }}
        visitCounts={mockVisitCounts}
      />
    );
  });
  afterEach(() => {
    // the docs recomment jest.runOnlyPendingTimers + jest.useRealTimers
    // but it doesn't work. this does.
    // see https://testing-library.com/docs/using-fake-timers/
    jest.clearAllTimers();
  });

  it("copies the provided visit counts as a csv to the clipboard", async () => {
    expect(global.navigator.clipboard.writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Copy counts as CSV"));
    await waitFor(() => {
      expect(screen.getAllByText("Copied!")).toHaveLength(1);
    });
    expect(global.navigator.clipboard.writeText).toHaveBeenCalled();
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
      `1,4,6,4${EOL}2,3,5,6${EOL}4,3,5,2${EOL}1,2,4,5${EOL}`
    );
  });

  it("reverts the button text after a second", async () => {
    fireEvent.click(screen.getByText("Copy counts as CSV"));
    expect(screen.getByText("Copy counts as CSV")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(await screen.findAllByText("Copied!")).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getAllByText("Copy counts as CSV")).toHaveLength(1);
    });
  });
});
