import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Main from "../containers/Main";
import LangContext from "../LangContext";
import { SPEED_MAP } from "../constants";
import { getTotalCount } from "./Main.test";

const intervals = Array.from(SPEED_MAP.values());
const defaultInterval = intervals[0];

const mockContext = {
  lang: "en",
  setLang: () => {},
};
// simplified from https://testing-library.com/docs/example-react-context/
const renderWithLang = (ui) => {
  return render(
    <LangContext.Provider value={mockContext}>{ui}</LangContext.Provider>
  );
};

describe("The Main component manual mode", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    renderWithLang(<Main />);
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  });

  it("allows user to switch to and from manual mode", () => {
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
    userEvent.click(screen.getByLabelText("Manual"));
    expect(screen.getByLabelText("Automatic")).not.toBeChecked();
    expect(screen.getByLabelText("Manual")).toBeChecked();
    userEvent.click(screen.getByLabelText("Automatic"));
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
  });

  it("allows user to click knight to legal square manually", async () => {
    userEvent.click(screen.getByLabelText("Manual"));
    expect(
      getComputedStyle(
        screen.getByAltText("Knight").parentElement
      ).getPropertyValue("cursor")
    ).toBe("pointer");

    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("c2").textContent).toBe("0");

    userEvent.click(screen.getByTitle("c2"));
    expect(screen.getByTitle("c2").textContent).toBe("1");
    expect(screen.getByTitle("a1").textContent).toBe("0");

    userEvent.click(screen.getByTitle("a1"));
    expect(screen.getByTitle("a1").textContent).toBe("1");
  });

  it("highlights legal target squares when user clicks in manual mode", () => {
    userEvent.click(screen.getByLabelText("Manual"));

    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("c2").getAttribute("class")).toContain(
      "drop-target"
    );
    expect(screen.getByTitle("b3").getAttribute("class")).toContain(
      "drop-target"
    );
    expect(screen.getByTitle("d1").getAttribute("class")).toBeNull();
    expect(screen.getByTitle("b2").getAttribute("class")).toBeNull();
  });

  it("removes highlight from target squares if user reclicks source square or clicks on an illegal square", () => {
    userEvent.click(screen.getByLabelText("Manual"));

    userEvent.click(screen.getByAltText("Knight"));
    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("c2").getAttribute("class")).toBeNull();
    expect(screen.getByTitle("b3").getAttribute("class")).toBeNull();

    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("c2").getAttribute("class")).toContain(
      "drop-target"
    );
    expect(screen.getByTitle("b3").getAttribute("class")).toContain(
      "drop-target"
    );

    userEvent.click(screen.getByTitle("a4"));
    expect(screen.getByTitle("c2").getAttribute("class")).toBeNull();
    expect(screen.getByTitle("b3").getAttribute("class")).toBeNull();
  });

  it("removes highlight from target squares if user switches to automatic mode", () => {
    userEvent.click(screen.getByLabelText("Manual"));
    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("b3").getAttribute("class")).toContain(
      "drop-target"
    );
    userEvent.click(screen.getByLabelText("Automatic"));
    expect(screen.getByTitle("b3").getAttribute("class")).toBeNull();
  });

  it("removes highlight from target squares if user resets the board", () => {
    userEvent.click(screen.getByLabelText("Manual"));
    userEvent.click(screen.getByAltText("Knight"));
    expect(screen.getByTitle("b3").getAttribute("class")).toContain(
      "drop-target"
    );
    userEvent.click(screen.getByText("Reset"));
    expect(screen.getByTitle("b3").getAttribute("class")).toBeNull();
  });

  it("allows user to drag and drop knight to legal square in manual mode", () => {
    const mockDragEvent = {
      dataTransfer: {
        setData: jest.fn(),
        dropEffect: "",
      },
    };
    userEvent.click(screen.getByLabelText("Manual"));
    fireEvent.dragStart(screen.getByAltText("Knight"), mockDragEvent);
    fireEvent.dragOver(screen.getByTitle("c2"), mockDragEvent);
    fireEvent.drop(screen.getByTitle("c2"), mockDragEvent);
    expect(screen.getByTitle("c2").textContent).toBe("1");
  });

  it("does not allow user to drag and drop knight to illegal square in manual mode", () => {
    const mockDragEvent = {
      dataTransfer: {
        setData: jest.fn(),
        dropEffect: "",
      },
    };
    userEvent.click(screen.getByLabelText("Manual"));
    fireEvent.dragStart(screen.getByAltText("Knight"), mockDragEvent);
    fireEvent.dragOver(screen.getByTitle("c3"), mockDragEvent);
    fireEvent.drop(screen.getByTitle("c3"), mockDragEvent);
    expect(screen.getByTitle("c3").textContent).toBe("0");
  });

  it("stops moving the knight when switching to manual mode", () => {
    userEvent.click(screen.getByText("Start"));

    jest.advanceTimersByTime(4 * defaultInterval);
    expect(getTotalCount(screen.getByRole("table"))).toBe(4);

    userEvent.click(screen.getByLabelText("Manual"));
    jest.advanceTimersByTime(4 * defaultInterval);
    expect(getTotalCount(screen.getByRole("table"))).toBe(4);
  });
});
