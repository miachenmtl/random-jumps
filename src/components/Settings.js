import { useState } from 'react';

import Checkbox from './Checkbox';

function Settings({
  speedNames,
  speedIndex,
  handleSpeed,
  displaySettings: { showKnight },
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
            handleChange={() => { toggleDisplaySettings('showKnight'); }}
          >Knight</Checkbox>
          <Checkbox
            id="show-counts"
            handleChange={() => { toggleDisplaySettings('showCounts'); }}
          >Counts</Checkbox>
          <Checkbox
            id="show-percentage"
            handleChange={() => { toggleDisplaySettings('showPercentage'); }}
          >Percentage</Checkbox>
          <Checkbox
            id="show-heatmap"
            handleChange={() => { toggleDisplaySettings('showHeatmap'); }}
          >Heatmap</Checkbox>
        </div>
      </div>
    </div>

  );
}

export default Settings;
