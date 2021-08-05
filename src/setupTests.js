// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "canvas";

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = observe;
    this.unobserve = unobserve;
    this.disconnect = disconnect;
  }
}

global.resizeObserverMethods = {
  observe,
  unobserve,
  disconnect,
};

global.ResizeObserver = MockResizeObserver;

Object.assign(global.navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
  lang: "en/US",
});
