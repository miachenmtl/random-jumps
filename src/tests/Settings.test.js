import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../containers/Settings';

const defaultProps = {
  speedNames: ['Slow', 'Fast'],
  speedIndex: 0,
  handleSpeed: () => {},
  displaySettings: {
    showKnight: true,
    showCounts: true,
    showPercent: false,
    showHeatmap: false
  },
  toggleDisplaySettings: ()  => {}
};

describe('The Settings component', () => {
  it('starts in a collapsed state and can be expanded', () => {
    render(<Settings {...defaultProps} />);
    const settingsButton = screen.getByRole('button', { name: 'Settings' });
    expect(screen.getByRole('combobox')).not.toBeVisible();
    fireEvent.click(settingsButton);
    expect(screen.getByRole('combobox')).toBeVisible();
    fireEvent.click(settingsButton);
    expect(screen.getByRole('combobox')).not.toBeVisible();
  });

  it('allows the user to toggle the visibility of the knight', () => {
    const spy = jest.fn();
    render(<Settings {...defaultProps} toggleDisplaySettings={spy} />);
    expect(spy).not.toHaveBeenCalled();
    const knightCheckbox = screen.getByLabelText('Knight');
    fireEvent.click(knightCheckbox);
    expect(spy).toHaveBeenCalledWith('showKnight');
  });
});