import { useState, useContext } from "react";

import Checkbox from "../components/Checkbox";
import NumberInput from "../components/NumberInput";
import { SPEED_MAP, MIN_INTERVAL } from "../constants";
import strings from "../strings";
import LangContext from "../LangContext";

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
  ROWS,
  COLS,
  NEW_BOARD,
  MODE,
  AUTOMATIC,
  MANUAL,
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
    showHighlight,
  },
  toggleDisplaySettings,
  initialTotalFiles,
  initialTotalRanks,
  changeDimensions,
  isManual,
  setMode,
}) {
  const { lang } = useContext(LangContext);
  const [newTotalFiles, setNewTotalFiles] = useState(initialTotalFiles);
  const [newTotalRanks, setNewTotalRanks] = useState(initialTotalRanks);

  const handleFiles = ({ target: { value } }) => {
    setNewTotalFiles(parseInt(value, 10));
  };
  const handleRanks = ({ target: { value } }) => {
    setNewTotalRanks(parseInt(value, 10));
  };
  const handleUpdate = () => {
    changeDimensions(newTotalFiles, newTotalRanks);
  };

  return (
    <div>
      <label htmlFor="speed-select">{SPEED[lang]}</label>
      <select
        id="speed-select"
        value={speedIndex.toString()}
        onChange={setSpeed}
        multiple={false}
      >
        {speedNames.map((nameObj, i) => (
          <option value={i.toString()} key={i}>
            {nameObj[lang]}
          </option>
        ))}
      </select>
      <div className="section" data-heading={SHOW[lang]}>
        <Checkbox
          id="show-knight"
          isChecked={showKnight}
          isDisabled={intervals[speedIndex] < MIN_INTERVAL}
          handleChange={() => {
            toggleDisplaySettings("showKnight");
          }}
        >
          {KNIGHT[lang]}
        </Checkbox>
        <Checkbox
          id="show-count"
          isChecked={showCount}
          handleChange={() => {
            toggleDisplaySettings("showCount");
          }}
        >
          {COUNT[lang]}
        </Checkbox>
        <Checkbox
          id="show-percent"
          isChecked={showPercent}
          handleChange={() => {
            toggleDisplaySettings("showPercent");
          }}
        >
          {PERCENT_MAX[lang]}
        </Checkbox>
        <Checkbox
          id="show-heatmap"
          isChecked={showHeatmap}
          handleChange={() => {
            toggleDisplaySettings("showHeatmap");
          }}
        >
          {HEATMAP[lang]}
        </Checkbox>
        <Checkbox
          id="show-highlight"
          isChecked={showHighlight}
          handleChange={() => {
            toggleDisplaySettings("showHighlight");
          }}
        >
          {HIGHLIGHT[lang]}
        </Checkbox>
      </div>
      <div className="section" data-heading={BOARD[lang]}>
        <NumberInput
          label={RANKS[lang]}
          title={ROWS[lang]}
          value={newTotalRanks}
          handleChange={handleRanks}
        />
        <NumberInput
          label={FILES[lang]}
          title={COLS[lang]}
          value={newTotalFiles}
          handleChange={handleFiles}
        />
        <button
          type="button"
          className="button button-link"
          onClick={handleUpdate}
        >
          {NEW_BOARD[lang]}
        </button>
      </div>
      <section className="section" data-heading={MODE[lang]}>
        <div>
          <input
            type="radio"
            id="auto-mode"
            name="mode-radio"
            value="auto"
            checked={!isManual}
            onChange={setMode}
          />
          <label htmlFor="auto-mode">{AUTOMATIC[lang]}</label>
        </div>
        <div>
          <input
            type="radio"
            id="manual-mode"
            name="mode-radio"
            value="manual"
            checked={isManual}
            onChange={setMode}
          />
          <label htmlFor="manual-mode">{MANUAL[lang]}</label>
        </div>
      </section>
    </div>
  );
}

export default Settings;
