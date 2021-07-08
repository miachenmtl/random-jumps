import { render, screen, fireEvent, within } from "@testing-library/react";

import Main from "../containers/Main";
import { SPEED_MAP } from "../constants";

const speedNames = Array.from(SPEED_MAP.keys());
const intervals = Array.from(SPEED_MAP.values());
const defaultInterval = intervals[0];

function getTotalCount(element) {
  const squares = within(element).getAllByText(/^\d+$/);
  const counts = squares.map((squareEl) => parseInt(squareEl.innerHTML, 10));
  const total = counts.reduce((acc, val) => acc + val);
  return total;
}

describe("The Main container", () => {
  beforeEach(() => {
    render(<Main />);
    jest.useFakeTimers();
  });

  afterEach(() => {
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
    expect(global.setInterval).not.toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(screen.getAllByText("1")).toHaveLength(1);

    jest.advanceTimersByTime(defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(2);

    jest.advanceTimersByTime(defaultInterval);
    const board = screen.getByRole("table");
    const totalCount = getTotalCount(board);
    expect(totalCount).toBe(3);
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
    fireEvent.click(startButton);
    expect(screen.getAllByText("1")).toHaveLength(1);

    jest.advanceTimersByTime(defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(2);
    const speedSelect = screen.getByRole("combobox", { name: "Speed" });
    fireEvent.change(speedSelect, { target: { value: speedNames[2] } });

    jest.advanceTimersByTime(defaultInterval);
    const expectedCalls = 2 + Math.floor(defaultInterval / intervals[2]);
    const totalCount = getTotalCount(screen.getByRole("table"));
    expect(totalCount).toBe(expectedCalls);
  });

  it("hides the knight while moving at warp speed", async () => {
    const startButton = screen.getByText("Start");
    const speedSelect = screen.getByLabelText("Speed");
    fireEvent.change(speedSelect, { target: { value: speedNames[4] } });
    fireEvent.click(startButton);
    expect(screen.queryByAltText("Knight")).toBeNull();

    jest.advanceTimersByTime(defaultInterval);
    const expectedTotal = defaultInterval / intervals[4] + 1; // the initial total is 1
    const actual = getTotalCount(screen.getByRole("table"));
    expect(actual).toBe(expectedTotal);
  });

  it("resets the visit counts and stops moving when the user presses reset", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(2);
    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);
    expect(screen.getAllByText("1")).toHaveLength(1);

    jest.advanceTimersByTime(2 * defaultInterval);
    expect(screen.getAllByText("1")).toHaveLength(1);
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
    const getEmptySquareCount = () =>
      within(screen.getByRole("table")).getAllByText("0").length;
    const emptySquareCount = getEmptySquareCount();
    expect(emptySquareCount).toBe(63);
    const showCountCheckbox = screen.getByRole("checkbox", { name: "Count" });
    fireEvent.click(showCountCheckbox);
    expect(screen.queryByText("0")).toBeNull();
    fireEvent.click(showCountCheckbox);
    expect(emptySquareCount).toBe(63);
  });

  it("allows the user to show and hide the percentage for each square", () => {
    expect(screen.queryByText("0%")).toBeNull();
    const showPercentCheckbox = screen.getByRole("checkbox", {
      name: "% of max",
    });
    fireEvent.click(showPercentCheckbox);
    const expectedCount = 63;
    const actual = within(screen.getByRole("table")).getAllByText("0%").length;
    expect(actual).toBe(expectedCount);
    fireEvent.click(showPercentCheckbox);
    expect(screen.queryByText("0%")).toBeNull();
  });

  it("correctly shows the percentage of max visits for each square", () => {
    const showPercentCheckbox = screen.getByRole("checkbox", {
      name: "% of max",
    });
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    fireEvent.click(showPercentCheckbox);

    jest.advanceTimersByTime(2 * defaultInterval);

    // if knight returned to initial square, it will be 100% and 50%
    // otherwise, there will be three 100%

    const maxPercentCount = screen.getAllByText("100%").length;

    // this is probably a bad idea because of possibility of unreproducibility
    // due to rng, but mocking the random moves is both unwieldy and non-user-oriented
    // TODO: if there's a manual mode implememnted, this can be circumvented
    let isCorrect = false;
    if (maxPercentCount === 1) {
      if (screen.getAllByText("50%").length === 1) {
        isCorrect = true;
      }
    }
    if (maxPercentCount === 3) {
      if (screen.getAllByText("0%").length === 61) {
        isCorrect = true;
      }
    }
    expect(isCorrect).toBe(true);
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

    const expectedCount = 63;
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
    const knightSquare = within(screen.getByRole("table")).getByText(
      "1"
    ).parentElement;
    expect(knightSquare.getAttribute("title")).toBe("d5");
    expect(document.querySelectorAll(".dragged")).toHaveLength(0);
  });

  it("does not allow the user to drag the knight when moving or moved", () => {
    const knight = screen.getByAltText("Knight");
    expect(knight.getAttribute("draggable")).toBeTruthy();
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(defaultInterval);
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
});
