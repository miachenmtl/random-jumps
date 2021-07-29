import {
  render,
  screen,
  act,
} from "@testing-library/react";

import Main from "../containers/Main";
import { SPEED_MAP } from "../constants";
import * as boardUtils from "../utils/boardUtils";

const intervals = Array.from(SPEED_MAP.values());
const defaultInterval = intervals[0];

describe("The percent view", () => {
  // For some weird reason, this test doesn't work when in a suite, but passes when isolated
  it("correctly shows the percentage of max visits for each square", async () => {
    jest.useFakeTimers();
    render(<Main />);

    const spy = jest
      .spyOn(boardUtils, "getLegalMoves")
      .mockImplementationOnce(() => [[2, 1]])
      .mockImplementationOnce(() => [[0, 0]])
      .mockImplementationOnce(() => [[2, 1]]);


    const showPercentCheckbox = screen.getByRole("checkbox", {
      name: "% of max",
    });
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    fireEvent.click(showPercentCheckbox);

    act(()=> {
      jest.advanceTimersByTime(3 * defaultInterval);
    });

    expect(spy).toHaveBeenCalledTimes(3);
    expect(await screen.findAllByText("100%")).toHaveLength(1);
    expect(await screen.findAllByText("50%")).toHaveLength(1);
  });
});