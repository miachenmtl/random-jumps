import { useState } from 'react';

import Checkbox from '../components/Checkbox';
import { SPEED_MAP, MIN_INTERVAL } from '../constants';

const intervals = Array.from(SPEED_MAP.values()); 

function Settings({
  speedNames,
  speedIndex,
  handleSpeed,
  displaySettings: {
    showKnight,
    showCount,
    showPercent,
    showHeatmap,
    showHighlight
  },
  toggleDisplaySettings
}) {
  const [expanded, setExpanded] = useState(false);
  const className = `settings-label${expanded ? ' expanded' : ''}`;
  const contentStyle = {
    opacity: expanded ? 1 : 0,
    transition: 'opacity 0.3s ease-in'
  };

  return (
    <div className="settings-panel">
      <div
        id="settings-label"
        className={className}
        role="button"
        aria-expanded={expanded}
        aria-controls="settings-controls"
        onClick={() => { setExpanded(!expanded); }}
      >
        Settings
      </div>
      <div
        className="settings-content"
        aria-labelledby="settings-label"
        style={contentStyle}
        data-testid="cx"
      >
        <label htmlFor="speed-select">Speed</label> 
        <select
          id="speed-select"
          value={speedNames[speedIndex]}
          onChange={handleSpeed}
          multiple={false}
        >
          {speedNames.map((name, i) => (
            <option value={name} key={i}>{name}</option>
          ))}
        </select>
        <div className="display-settings">
          <Checkbox
            id="show-knight"
            isChecked={showKnight}
            isDisabled={intervals[speedIndex] < MIN_INTERVAL}
            handleChange={() => { toggleDisplaySettings('showKnight'); }}
          >Knight</Checkbox>
          <Checkbox
            id="show-count"
            isChecked={showCount}
            handleChange={() => { toggleDisplaySettings('showCount'); }}
          >Count</Checkbox>
          <Checkbox
            id="show-percent"
            isChecked={showPercent}
            handleChange={() => { toggleDisplaySettings('showPercent'); }}
          >% of max</Checkbox>
          <Checkbox
            id="show-heatmap"
            isChecked={showHeatmap}
            handleChange={() => { toggleDisplaySettings('showHeatmap'); }}
          >Heatmap</Checkbox>
          <Checkbox
            id="show-highlight"
            isChecked={showHighlight}
            handleChange={() => { toggleDisplaySettings('showHighlight'); }}
          >Highlight</Checkbox>
        </div>
      </div>
    </div>

  );
}

export default Settings;
