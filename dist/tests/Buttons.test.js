function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { fireEvent, render, screen } from "@testing-library/react";
import Buttons from "../containers/Buttons";
import LangContext from "../LangContext";
import { SPEED_MAP, MIN_INTERVAL } from "../constants";
const defaultInterval = SPEED_MAP.values().next().value;
const intervals = Array.from(SPEED_MAP.values());
const defaultProps = {
  makeRandomMoves: () => {},
  resetBoard: () => {},
  totalFiles: 8,
  totalRanks: 8,
  interval: defaultInterval
};
const mockContext = {
  lang: "en",
  setLang: () => {}
}; // simplified from https://testing-library.com/docs/example-react-context/

const renderWithLang = ui => {
  return render( /*#__PURE__*/React.createElement(LangContext.Provider, {
    value: mockContext
  }, ui));
};

describe("The Buttons container", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  it("renders a Start button", () => {
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, defaultProps));
    const startButton = screen.getByText("Start");
    expect(startButton).toBeInTheDocument();
  });
  it("disables the start button and enables stop button after clicking", () => {
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, defaultProps));
    const startButton = screen.getByText("Start");
    const stopButton = screen.getByText("Stop");
    expect(startButton).not.toHaveAttribute("disabled");
    expect(stopButton).toHaveAttribute("disabled");
    fireEvent.click(startButton);
    jest.advanceTimersByTime(defaultInterval);
    expect(startButton).toHaveAttribute("disabled");
    expect(stopButton).not.toHaveAttribute("disabled");
    jest.clearAllTimers();
  });
  it("starts an interval timer to move the knight when the user clicks start", () => {
    const spy = jest.fn();
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy
    })));
    const startButton = screen.getByText("Start");
    expect(global.setInterval).not.toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(defaultInterval);
    expect(spy).toHaveBeenCalledTimes(2);
    jest.clearAllTimers();
  });
  it("lets the user speed up the knight moves", () => {
    const spy = jest.fn();
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy,
      interval: intervals[1]
    })));
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    const expectedCalls = Math.floor(defaultInterval / intervals[1]);
    expect(spy).toHaveBeenCalledTimes(expectedCalls);
    jest.advanceTimersByTime(defaultInterval);
    const moreExpectedCalls = Math.floor(2 * defaultInterval / intervals[1]);
    expect(spy).toHaveBeenCalledTimes(moreExpectedCalls);
  });
  it("lets the user speed up the knight moves a lot with batched updates", () => {
    const spy = jest.fn();
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy,
      interval: intervals[4]
    })));
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    expect(intervals[4]).toBeLessThan(MIN_INTERVAL);
    jest.advanceTimersByTime(defaultInterval);
    const expectedTimesCalled = Math.floor(defaultInterval / MIN_INTERVAL);
    const expectedBatchSize = MIN_INTERVAL / intervals[4];
    expect(spy).toHaveBeenCalledTimes(expectedTimesCalled);
    expect(spy).toHaveBeenCalledWith(expectedBatchSize);
    expect(spy).toHaveBeenLastCalledWith(expectedBatchSize);
  });
  it("lets the user speed up the knight while already moving", () => {
    const spy = jest.fn();
    let isMoving = false;

    const setIsMoving = bool => {
      isMoving = bool;
    };

    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy,
      isMoving: isMoving,
      setIsMoving: setIsMoving
    })));
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
    expect(global.clearInterval).not.toHaveBeenCalled();
    expect(global.setInterval).toHaveBeenCalledTimes(1); // imperatively changing interval, Main container tests UI

    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy,
      interval: intervals[4],
      isMoving: isMoving,
      setIsMoving: setIsMoving
    }))));
    jest.advanceTimersByTime(defaultInterval);
    expect(global.clearInterval).toHaveBeenCalled();
    expect(global.setInterval).toHaveBeenCalledTimes(2);
    const callInterval = Math.max(MIN_INTERVAL, intervals[4]);
    const expectedTimesCalled = 1 + Math.floor(defaultInterval / callInterval);
    const expectedBatchSize = MIN_INTERVAL / intervals[4];
    expect(spy).toHaveBeenCalledTimes(expectedTimesCalled);
    expect(spy).toHaveBeenLastCalledWith(expectedBatchSize);
  });
  it("stops the interval timer and the knight when the user clicks stop", () => {
    const spy = jest.fn();
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: spy
    })));
    const startButton = screen.getByText("Start");
    const stopButton = screen.getByText("Stop");
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.click(stopButton);
    expect(global.clearInterval).toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(global.setInterval).toHaveBeenCalledTimes(1);
  });
  it("calls resetBoard when user clicks reset and stops moving if needed", () => {
    const resetSpy = jest.fn();
    const makeRandomMovesSpy = jest.fn();
    renderWithLang( /*#__PURE__*/React.createElement(Buttons, _extends({}, defaultProps, {
      makeRandomMoves: makeRandomMovesSpy,
      resetBoard: resetSpy
    })));
    const startButton = screen.getByText("Start");
    const resetButton = screen.getByText("Reset");
    expect(resetSpy).not.toHaveBeenCalled();
    fireEvent.click(resetButton);
    expect(resetSpy).toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(makeRandomMovesSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(defaultInterval);
    expect(makeRandomMovesSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(resetButton);
    jest.advanceTimersByTime(6 * defaultInterval);
    expect(resetSpy).toHaveBeenCalledTimes(2);
    expect(makeRandomMovesSpy).toHaveBeenCalledTimes(1);
  });
  it("does not clear the interval timer when unmounting if not needed", () => {
    const {
      unmount
    } = renderWithLang( /*#__PURE__*/React.createElement(Buttons, defaultProps));
    expect(global.clearInterval).not.toHaveBeenCalled();
    unmount(); // timer not started, should not call clear interval

    expect(global.clearInterval).not.toHaveBeenCalled();
  });
  it("clears the interval timer when unmounting if needed", () => {
    const {
      unmount
    } = renderWithLang( /*#__PURE__*/React.createElement(Buttons, defaultProps));
    expect(global.clearInterval).not.toHaveBeenCalled();
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    unmount();
    expect(global.clearInterval).toHaveBeenCalled();
  });
});