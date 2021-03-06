import {
  render,
  screen,
  act,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";

import Main from "../containers/Main";
import { SPEED_MAP } from "../constants";
import * as boardUtils from "../utils/boardUtils";
import LangContext from "../LangContext";

const intervals = Array.from(SPEED_MAP.values());
const defaultInterval = intervals[0];

function getTotalCount(element) {
  const squares = within(element).getAllByText(/^\d+$/);
  const counts = squares.map((squareEl) => parseInt(squareEl.innerHTML, 10));
  const total = counts.reduce((acc, val) => acc + val);
  return total;
}

const mockContext = {
  lang: "en",
  setLang: () => {},
};

describe("The Main container", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(
      <LangContext.Provider value={mockContext}>
        <Main lang="en" />
      </LangContext.Provider>
    );
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  });

  it("renders 8 ranks (rows) and 64 squares (cells) in a table body", () => {
    const tBodyEl = screen.getByRole("rowgroup");
    expect(tBodyEl).toBeInTheDocument();

    const rankEls = screen.getAllByRole("row");
    expect(rankEls).toHaveLength(8);

    const squareEls = screen.getAllByRole("cell");
    expect(squareEls).toHaveLength(64);
  });

  it("renders the a1 square as the first square of the bottom rank", () => {
    const squareEl = screen.getByTitle("a1");
    expect(squareEl).toBeInTheDocument();
    expect(squareEl.tagName).toBe("TD");

    const firstRank = squareEl.parentElement;
    expect(firstRank).toBeInTheDocument();
    expect(firstRank.firstElementChild).toBe(squareEl);
    expect(firstRank.tagName).toBe("TR");

    const tableBody = firstRank.parentElement;
    expect(tableBody).toBeInTheDocument();
    expect(tableBody.lastElementChild).toBe(firstRank);
    expect(tableBody.tagName).toBe("TBODY");
  });

  it("renders the c5 square right after the b5 square", () => {
    const b5Square = screen.getByTitle("b5");
    expect(b5Square).toBeInTheDocument();

    const c5Square = screen.getByTitle("c5");
    expect(c5Square).toBeInTheDocument();

    expect(c5Square).toBe(b5Square.nextSibling);
  });

  it("starts a ResizeObserver after mounting and disconnects before unmounting", () => {
    const { unmount } = render(<Main />);
    expect(global.resizeObserverMethods.observe).toHaveBeenCalled();
    expect(global.resizeObserverMethods.disconnect).not.toHaveBeenCalled();
    unmount();
    expect(global.resizeObserverMethods.disconnect).toHaveBeenCalled();
  });

  it("makes random moves and updates visit counts when the user presses the start button", () => {
    const startButton = screen.getByText("Start");
    expect(startButton).toBeInTheDocument();
    const board = screen.getByRole("table");

    expect(global.setInterval).not.toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(within(board).queryAllByText("1")).toHaveLength(0);

    jest.advanceTimersByTime(defaultInterval);
    expect(within(board).getAllByText("1")).toHaveLength(1);

    jest.advanceTimersByTime(defaultInterval);
    const totalCount = getTotalCount(board);
    expect(totalCount).toBe(2);
  });

  it("stops moving and updating visit counts when the user presses stop after starting", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(2);
    const stopButton = screen.getByText("Stop");
    fireEvent.click(stopButton);

    jest.advanceTimersByTime(2 * defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(2);
  });

  it("lets the user change speed while moving", async () => {
    const startButton = screen.getByText("Start");
    const board = screen.getByRole("table");

    fireEvent.click(startButton);
    expect(within(board).queryAllByText("1")).toHaveLength(0);

    jest.advanceTimersByTime(defaultInterval);
    expect(within(board).getAllByText("1")).toHaveLength(1);
    const speedSelect = screen.getByRole("combobox", { name: "Speed" });
    fireEvent.change(speedSelect, { target: { value: "2" } });

    jest.advanceTimersByTime(defaultInterval);
    const expectedCalls = 1 + Math.floor(defaultInterval / intervals[2]);
    const totalCount = getTotalCount(screen.getByRole("table"));
    expect(totalCount).toBe(expectedCalls);
  });

  it("hides the knight while moving at warp speed", async () => {
    const startButton = screen.getByText("Start");
    const speedSelect = screen.getByLabelText("Speed");
    fireEvent.change(speedSelect, { target: { value: "4" } });
    fireEvent.click(startButton);
    expect(screen.queryByAltText("Knight")).toBeNull();

    jest.advanceTimersByTime(defaultInterval);
    const expectedTotal = defaultInterval / intervals[4];
    const actual = getTotalCount(screen.getByRole("table"));
    expect(actual).toBe(expectedTotal);
  });

  it("resets the visit counts and stops moving when the user presses reset", () => {
    const startButton = screen.getByText("Start");
    const board = screen.getByRole("table");

    fireEvent.click(startButton);

    jest.advanceTimersByTime(defaultInterval);
    expect(within(board).getAllByText("1")).toHaveLength(1);
    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);
    expect(within(board).queryAllByText("1")).toHaveLength(0);

    jest.advanceTimersByTime(2 * defaultInterval);
    expect(within(board).queryAllByText("1")).toHaveLength(0);
  });

  it("allows the user to show and hide the knight", async () => {
    const knight = screen.getByAltText("Knight");
    expect(knight).toBeVisible();
    const showKnightCheckbox = screen.getByRole("checkbox", { name: "Knight" });
    fireEvent.click(showKnightCheckbox);
    expect(knight).not.toBeVisible();
    fireEvent.click(showKnightCheckbox);
    expect(screen.getByAltText("Knight")).toBeVisible();
  });

  it("allows the user to show and hide the count for each square", async () => {
    const board = screen.getByRole("table");
    const getEmptySquareCount = () => within(board).getAllByText("0").length;
    const emptySquareCount = getEmptySquareCount();
    expect(emptySquareCount).toBe(64);
    const showCountCheckbox = screen.getByRole("checkbox", { name: "Count" });
    fireEvent.click(showCountCheckbox);
    expect(within(board).queryByText("0")).toBeNull();
    fireEvent.click(showCountCheckbox);
    expect(emptySquareCount).toBe(64);
  });

  it("allows the user to show and hide the percentage for each square", () => {
    expect(screen.queryByText("0%")).toBeNull();
    const showPercentCheckbox = screen.getByRole("checkbox", {
      name: "% of max",
    });
    fireEvent.click(showPercentCheckbox);
    const expectedCount = 64;
    const actual = within(screen.getByRole("table")).getAllByText("0%").length;
    expect(actual).toBe(expectedCount);
    fireEvent.click(showPercentCheckbox);
    expect(screen.queryByText("0%")).toBeNull();
  });

  it("allows the user to turn heatmap mode on and off for each square", () => {
    // not ideal bc css is not applied in test environment
    // it depends on the hardcoded 'white' bg color workaround
    const getWhiteSquareCount = () => {
      const squares = screen.getAllByRole("cell");
      // NB: logging the bg color in Square.js gives yields #ffffff
      const whiteSquareCount = squares.reduce(
        (acc, square) =>
          acc +
          +(
            getComputedStyle(square).getPropertyValue("background-color") ===
            "rgb(255, 255, 255)"
          ),
        0
      );
      return whiteSquareCount;
    };
    const initialCount = getWhiteSquareCount();
    expect(initialCount).toBe(0);
    const showHeatmapCheckbox = screen.getByRole("checkbox", {
      name: "Heatmap",
    });
    fireEvent.click(showHeatmapCheckbox);

    const expectedCount = 64;
    const actualCount = getWhiteSquareCount();
    expect(actualCount).toBe(expectedCount);

    fireEvent.click(showHeatmapCheckbox);
    const resetLightSquareCount = getWhiteSquareCount();
    expect(resetLightSquareCount).toBe(0);
  });

  it("allows the user to turn the square highlight on and off", () => {
    expect(document.querySelectorAll(".current")).toHaveLength(1);
    const showHighlightCheckbox = screen.getByRole("checkbox", {
      name: "Highlight",
    });
    fireEvent.click(showHighlightCheckbox);
    expect(document.querySelectorAll(".current")).toHaveLength(0);
    fireEvent.click(showHighlightCheckbox);
    expect(document.querySelectorAll(".current")).toHaveLength(1);
  });

  it("allows the user to drag and drop the initial position of the knight", () => {
    const knight = screen.getByAltText("Knight");
    const dragOverSquare = screen.getByTitle("c3");
    const dropSquare = screen.getByTitle("d5");

    const mockDragEvent = {
      dataTransfer: {
        setData: jest.fn(),
        dropEffect: "",
      },
    };
    fireEvent.dragStart(knight, mockDragEvent);
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalled();
    expect(mockDragEvent.dataTransfer.setData.mock.calls[0][0]).toBe(
      "text/plain"
    );
    expect(mockDragEvent.dataTransfer.setData.mock.calls[0][1]).toBe("0,7"); // 7 is the visual rank index
    expect(mockDragEvent.dataTransfer.dropEffect).toBe("move");
    const dragHighlightSquare = document.querySelector(".dragged");
    expect(dragHighlightSquare.getAttribute("title")).toBe("a1");

    expect(document.querySelectorAll(".drop-target")).toHaveLength(0);
    fireEvent.dragOver(dragOverSquare, mockDragEvent);
    expect(document.querySelectorAll(".drop-target")).toHaveLength(1);
    expect(document.querySelector(".drop-target").getAttribute("title")).toBe(
      "c3"
    );

    fireEvent.dragLeave(dragOverSquare, mockDragEvent);
    expect(document.querySelectorAll(".drop-target")).toHaveLength(0);

    fireEvent.drop(dropSquare, mockDragEvent);
    fireEvent.dragEnd(knight);
    const knightSquare = document.querySelector(".current");
    expect(knightSquare.getAttribute("title")).toBe("d5");
    expect(document.querySelectorAll(".dragged")).toHaveLength(0);
  });

  it("does not allow the user to drag the knight when moving or moved", () => {
    const knight = screen.getByAltText("Knight");
    expect(knight.getAttribute("draggable")).toBeTruthy();
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(defaultInterval);
    });
    expect(knight.getAttribute("draggable")).toBe("false");

    const stopButton = screen.getByText("Stop");
    fireEvent.click(stopButton);

    jest.advanceTimersByTime(2 * defaultInterval);
    expect(knight.getAttribute("draggable")).toBe("false");
  });

  it("allows the user to change the board dimensions", () => {
    const ranksInput = screen.getByLabelText("Ranks");
    const filesInput = screen.getByLabelText("Files");
    fireEvent.change(ranksInput, { target: { value: "10" } });
    fireEvent.change(filesInput, { target: { value: "12" } });
    const newBoardButton = screen.getByText("New Board");
    expect(screen.getAllByRole("cell")).toHaveLength(64);
    expect(screen.queryByTitle("l9")).toBeNull();

    fireEvent.click(newBoardButton);
    expect(screen.getAllByRole("cell")).toHaveLength(120);
    expect(screen.getAllByRole("row")).toHaveLength(10);
    expect(screen.getByTitle("l9")).toBeInTheDocument();
  });

  it("allows the user to change the board dimensions while the knight is moving", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(2 * defaultInterval);
    expect(global.setInterval).toHaveBeenCalledTimes(1);
    expect(global.clearInterval).not.toHaveBeenCalled();
    const ranksInput = screen.getByLabelText("Ranks");
    const filesInput = screen.getByLabelText("Files");
    fireEvent.change(ranksInput, { target: { value: "10" } });
    fireEvent.change(filesInput, { target: { value: "12" } });
    const newBoardButton = screen.getByText("New Board");
    expect(screen.getAllByRole("cell")).toHaveLength(64);

    fireEvent.click(newBoardButton);
    jest.advanceTimersByTime(2 * defaultInterval);
    expect(global.setInterval).toHaveBeenCalledTimes(1);
    expect(global.clearInterval).toHaveBeenCalled();
    expect(screen.getAllByRole("cell")).toHaveLength(120);
    expect(screen.getAllByRole("row")).toHaveLength(10);
  });

  it("displays total moves in the stats sidebar", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(2 * defaultInterval);
    const leftPanel = screen.getByText("Stats for nerds").parentElement;
    expect(within(leftPanel).getByLabelText("Total moves:")).toHaveTextContent(
      "2"
    );
  });

  it("displays stats for returning to initial square in the sidebar", () => {
    jest
      .spyOn(boardUtils, "getLegalMoves")
      .mockImplementationOnce(() => [[2, 1]])
      .mockImplementationOnce(() => [[0, 0]])
      .mockImplementationOnce(() => [[2, 1]])
      .mockImplementationOnce(() => [[4, 2]])
      .mockImplementationOnce(() => [[2, 1]])
      .mockImplementationOnce(() => [[0, 0]]);

    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(2 * defaultInterval);
    const returnStatsEl = document.querySelector(
      '[data-heading="To initial square"]'
    );
    expect(
      within(returnStatsEl).getByLabelText("Moves per trip:")
    ).toHaveTextContent("2");
    expect(
      within(returnStatsEl).getByLabelText("Completed trips:")
    ).toHaveTextContent("1");
    expect(within(returnStatsEl).getByLabelText("Average:")).toHaveTextContent(
      "2"
    );

    jest.advanceTimersByTime(4 * defaultInterval);
    expect(
      within(returnStatsEl).getByLabelText("Completed trips:")
    ).toHaveTextContent("2");
    expect(
      within(returnStatsEl).getByLabelText("Moves per trip:")
    ).toHaveTextContent("2, 4");
    expect(within(returnStatsEl).getByLabelText("Average:")).toHaveTextContent(
      "3"
    );
  });

  it("displays stats for visiting all squares in the sidebar", async () => {
    // switch to a 3 x 3 board
    const ranksInput = screen.getByLabelText("Ranks");
    const filesInput = screen.getByLabelText("Files");
    fireEvent.change(ranksInput, { target: { value: "3" } });
    fireEvent.change(filesInput, { target: { value: "3" } });
    const newBoardButton = screen.getByText("New Board");

    fireEvent.click(newBoardButton);
    // we'll cheat and use king moves
    jest
      .spyOn(boardUtils, "getLegalMoves")
      .mockImplementationOnce(() => [[0, 1]])
      .mockImplementationOnce(() => [[0, 2]])
      .mockImplementationOnce(() => [[1, 2]])
      .mockImplementationOnce(() => [[2, 2]])
      .mockImplementationOnce(() => [[2, 1]])
      .mockImplementationOnce(() => [[1, 1]])
      .mockImplementationOnce(() => [[1, 0]])
      .mockImplementationOnce(() => [[2, 0]]);

    await waitFor(() => {
      expect(screen.getAllByRole("cell")).toHaveLength(9);
    });

    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    jest.advanceTimersByTime(8 * defaultInterval);
    const tourStatsEl = document.querySelector(
      '[data-heading="To all squares"]'
    );
    expect(
      within(tourStatsEl).getByLabelText("Completed trips:")
    ).toHaveTextContent("1");
    expect(
      within(tourStatsEl).getByLabelText("Moves per trip:")
    ).toHaveTextContent("8");
    expect(within(tourStatsEl).getByLabelText("Average:")).toHaveTextContent(
      "8"
    );
  });
});

export { getTotalCount };
