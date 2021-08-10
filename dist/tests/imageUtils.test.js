import { ImageData } from 'canvas';
import { getGradientImageData, getHeatmapRGB } from "../utils/imageUtils";
describe('The getGradientImageData util', () => {
  it('creates an ImageData object of the right size', () => {
    const width = 100;
    const colorStops = ['white', 'black'];
    const actualImageData = getGradientImageData(width, colorStops);
    expect(actualImageData instanceof ImageData).toBeTruthy();
    expect(actualImageData.data.length).toBe(4 * width);
  });
});
describe('The getHeatmapRGB util', () => {
  it('takes an ImageData object and a number between 0 and 1 and returns the right color as hex string', () => {
    const width = 100;
    const colorStops = ['black', '#00ff00']; // does this depend on canvas implementation?

    const imageData = getGradientImageData(width, colorStops);
    const expected = '#007e00';
    const actual = getHeatmapRGB(0.5, imageData);
    expect(actual).toBe(expected);
  });
  it('works at the beginning and end of the gradient', () => {
    const width = 300;
    const colorStops = ['black', '#00ff00']; // does this depend on canvas implementation?

    const imageData = getGradientImageData(width, colorStops);
    const expectedBlack = '#000000';
    const actualBlack = getHeatmapRGB(0, imageData);
    expect(actualBlack).toBe(expectedBlack);
    const expectedGreen = '#00ff00';
    const actualGreen = getHeatmapRGB(1, imageData);
    expect(actualGreen).toBe(expectedGreen);
  });
});