function getGradientImageData(canvasWidth, colorStops) {
  const virtualCanvas = document.createElement('canvas');
  virtualCanvas.height = 1;
  virtualCanvas.width = canvasWidth;
  const canvasContext = virtualCanvas.getContext('2d');
  const heatmapGradient = canvasContext.createLinearGradient(0, 0, canvasWidth, 0);
  colorStops.forEach((colorStop, i) => {
    heatmapGradient.addColorStop(i / (colorStops.length - 1), colorStop);
  });
  canvasContext.fillStyle = heatmapGradient;
  canvasContext.fillRect(0, 0, canvasWidth, 1);
  const gradientImageData = canvasContext.getImageData(0, 0, canvasWidth, 1);
  return gradientImageData;
}

function getHeatmapRGB(heatValue, imageData) {
  const {
    length
  } = imageData.data;
  const rawIndex = heatValue * (length - 1);
  const index = rawIndex - rawIndex % 4;
  const rbgInts = Array.from(imageData.data.slice(index, index + 3));
  const [red, green, blue] = rbgInts.map(byte => byte.toString(16)).map(string => string.length === 1 ? `0${string}` : string);
  return `#${red}${green}${blue}`;
}

export { getGradientImageData, getHeatmapRGB };