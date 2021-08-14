import { useState, useContext } from "react";
import Checkbox from "../components/Checkbox";
import NumberInput from "../components/NumberInput";
import { SPEED_MAP, MIN_INTERVAL } from "../constants";
import strings from "../strings";
import LangContext from "../LangContext";
import style from "./Panels.module.css";
const intervals = Array.from(SPEED_MAP.values());
const {
  SPEED,
  SHOW,
  KNIGHT,
  COUNT,
  PERCENT_MAX,
  HEATMAP,
  HIGHLIGHT,
  BOARD,
  RANKS,
  FILES,
  NEW_BOARD,
  MODE,
  AUTOMATIC,
  MANUAL
} = strings;

function Settings({
  speedNames,
  speedIndex,
  setSpeed,
  displaySettings: {
    showKnight,
    showCount,
    showPercent,
    showHeatmap,
    showHighlight
  },
  toggleDisplaySettings,
  initialTotalFiles,
  initialTotalRanks,
  changeDimensions,
  isManual,
  setMode
}) {
  const {
    lang
  } = useContext(LangContext);
  const [newTotalFiles, setNewTotalFiles] = useState(initialTotalFiles);
  const [newTotalRanks, setNewTotalRanks] = useState(initialTotalRanks);

  const handleFiles = ({
    target: {
      value
    }
  }) => {
    setNewTotalFiles(parseInt(value, 10));
  };

  const handleRanks = ({
    target: {
      value
    }
  }) => {
    setNewTotalRanks(parseInt(value, 10));
  };

  const handleUpdate = () => {
    changeDimensions(newTotalFiles, newTotalRanks);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: style.label,
    htmlFor: "speed-select"
  }, SPEED[lang]), /*#__PURE__*/React.createElement("select", {
    id: "speed-select",
    className: style.select,
    value: speedIndex.toString(),
    onChange: setSpeed,
    multiple: false
  }, speedNames.map((nameObj, i) => /*#__PURE__*/React.createElement("option", {
    value: i.toString(),
    key: i
  }, nameObj[lang]))), /*#__PURE__*/React.createElement("div", {
    className: style.section,
    "data-heading": SHOW[lang]
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: "show-knight",
    isChecked: showKnight,
    isDisabled: intervals[speedIndex] < MIN_INTERVAL,
    handleChange: () => {
      toggleDisplaySettings("showKnight");
    }
  }, KNIGHT[lang]), /*#__PURE__*/React.createElement(Checkbox, {
    id: "show-count",
    isChecked: showCount,
    handleChange: () => {
      toggleDisplaySettings("showCount");
    }
  }, COUNT[lang]), /*#__PURE__*/React.createElement(Checkbox, {
    id: "show-percent",
    isChecked: showPercent,
    handleChange: () => {
      toggleDisplaySettings("showPercent");
    }
  }, PERCENT_MAX[lang]), /*#__PURE__*/React.createElement(Checkbox, {
    id: "show-heatmap",
    isChecked: showHeatmap,
    handleChange: () => {
      toggleDisplaySettings("showHeatmap");
    }
  }, HEATMAP[lang]), /*#__PURE__*/React.createElement(Checkbox, {
    id: "show-highlight",
    isChecked: showHighlight,
    handleChange: () => {
      toggleDisplaySettings("showHighlight");
    }
  }, HIGHLIGHT[lang])), /*#__PURE__*/React.createElement("div", {
    className: style.section,
    "data-heading": BOARD[lang]
  }, /*#__PURE__*/React.createElement(NumberInput, {
    label: RANKS[lang],
    value: newTotalRanks,
    handleChange: handleRanks
  }), /*#__PURE__*/React.createElement(NumberInput, {
    label: FILES[lang],
    value: newTotalFiles,
    handleChange: handleFiles
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: style.buttonLink,
    onClick: handleUpdate
  }, NEW_BOARD[lang])), /*#__PURE__*/React.createElement("section", {
    className: style.section,
    "data-heading": MODE[lang]
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    className: style.radio,
    id: "auto-mode",
    name: "mode-radio",
    value: "auto",
    checked: !isManual,
    onChange: setMode
  }), /*#__PURE__*/React.createElement("label", {
    className: style.radio,
    htmlFor: "auto-mode"
  }, AUTOMATIC[lang])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    className: style.radio,
    id: "manual-mode",
    name: "mode-radio",
    value: "manual",
    checked: isManual,
    onChange: setMode
  }), /*#__PURE__*/React.createElement("label", {
    className: style.radio,
    htmlFor: "manual-mode"
  }, MANUAL[lang]))));
}

export default Settings;