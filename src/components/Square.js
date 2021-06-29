const Square = ({
  visitCount,
  maxSquareCount,
  squareName,
  getHeatmapHexString,
  isCurrent,
  displaySettings: {
    showCount,
    showPercent,
    showHeatmap,
    showHighlight
  }

}) => {
  const ratio = visitCount / maxSquareCount;
  const percentText = `${Math.round(100 * ratio)}%`;
  const style = showHeatmap ?
    { backgroundColor: getHeatmapHexString(ratio) }
    : null;
  return (
  <td
    className={(isCurrent && showHighlight) ? 'current' : undefined}
    title={squareName}
    style={style}
  >
    { showPercent &&
      <span className='percent'>
        {percentText}
      </span>
    }
    { showCount &&
      <span className='count'>
        {visitCount}
      </span>
    }
  </td>
  );
}

export default Square;
