function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Settings from "../containers/Settings";
import LangContext from "../LangContext";
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
    showHighlight: true
  },
  toggleDisplaySettings: () => {},
  initialTotalFiles: 8,
  initialTotalRanks: 8,
  changeDimensions: () => {},
  isManual: false
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

describe("The Settings component", () => {
  // imperatively changing props; user-directed behaviour tested in Main
  it("allows the user to toggle the visibility of the knight", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      toggleDisplaySettings: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Knight")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Knight"));
    expect(spy).toHaveBeenCalledWith("showKnight");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showKnight: false
    });
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      displaySettings: newDisplaySettings
    }))));
    expect(screen.getByLabelText("Knight")).not.toBeChecked();
  });
  it("allows the user to toggle the visibility of each square count", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      toggleDisplaySettings: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Count")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Count"));
    expect(spy).toHaveBeenCalledWith("showCount");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showCount: false
    });
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      displaySettings: newDisplaySettings
    }))));
    expect(screen.getByLabelText("Count")).not.toBeChecked();
  });
  it("allows the user to toggle the visibility of the percent of max", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      toggleDisplaySettings: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("% of max")).not.toBeChecked();
    fireEvent.click(screen.getByLabelText("% of max"));
    expect(spy).toHaveBeenCalledWith("showPercent");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showPercent: true
    });
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      displaySettings: newDisplaySettings
    }))));
    expect(screen.getByLabelText("% of max")).toBeChecked();
  });
  it("allows the user to toggle the visibility of the heatmap", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      toggleDisplaySettings: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Heatmap")).not.toBeChecked();
    fireEvent.click(screen.getByLabelText("Heatmap"));
    expect(spy).toHaveBeenCalledWith("showHeatmap");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showHeatmap: true
    });
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      displaySettings: newDisplaySettings
    }))));
    expect(screen.getByLabelText("Heatmap")).toBeChecked();
  });
  it("allows the user to toggle the visibility of highlighted squares", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      toggleDisplaySettings: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Highlight")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Highlight"));
    expect(spy).toHaveBeenCalledWith("showHighlight");
    const newDisplaySettings = Object.assign({}, defaultProps.displaySettings, {
      showHighlight: false
    });
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      displaySettings: newDisplaySettings
    }))));
    expect(screen.getByLabelText("Highlight")).not.toBeChecked();
  });
  it("toggles between automatic and manual mode", () => {
    const spy = jest.fn();
    const {
      rerender
    } = renderWithLang( /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      setMode: spy
    })));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
    userEvent.click(screen.getByLabelText("Manual"));
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].target.value).toBe("manual");
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      setMode: spy,
      isManual: true
    }))));
    expect(screen.getByLabelText("Automatic")).not.toBeChecked();
    expect(screen.getByLabelText("Manual")).toBeChecked();
    userEvent.click(screen.getByLabelText("Automatic"));
    rerender( /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: mockContext
    }, /*#__PURE__*/React.createElement(Settings, _extends({}, defaultProps, {
      setMode: spy,
      isManual: false
    }))));
    expect(spy.mock.calls[1][0].target.value).toBe("auto");
    expect(screen.getByLabelText("Automatic")).toBeChecked();
    expect(screen.getByLabelText("Manual")).not.toBeChecked();
  });
});