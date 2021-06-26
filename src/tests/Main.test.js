import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'

import Main from '../container/Main';

function getTotalCount(element) {
  const squares = within(element).getAllByText(/^\d+$/);
  const counts = squares.map(squareEl => parseInt(squareEl.innerHTML, 10));
  const total = counts.reduce((acc, val) => acc + val);
  return total;
};

describe('The Main container', () => {
  beforeEach(() => {
    render(<Main />);
  });

  it('renders 8 ranks (rows) and 64 squares (cells) in a table body', () => {
    const tBodyEl = screen.getByRole('rowgroup');
    expect(tBodyEl).toBeInTheDocument();

    const rankEls = screen.getAllByRole('row');
    expect(rankEls).toHaveLength(8);

    const squareEls = screen.getAllByRole('cell');
    expect(squareEls).toHaveLength(64);
  });

  it('renders the a1 square as the first square of the bottom rank', () => {
    const squareEl = screen.getByTitle('a1');
    expect(squareEl).toBeInTheDocument();
    expect(squareEl.tagName).toBe('TD');

    const firstRank = squareEl.parentElement;
    expect(firstRank).toBeInTheDocument();
    expect(firstRank.firstElementChild).toBe(squareEl);
    expect(firstRank.tagName).toBe('TR');

    const tableBody = firstRank.parentElement;
    expect(tableBody).toBeInTheDocument();
    expect(tableBody.lastElementChild).toBe(firstRank);
    expect(tableBody.tagName).toBe('TBODY');
  });

  it('renders the c5 square right after the b5 square', () => {
    const b5Square = screen.getByTitle('b5');
    expect(b5Square).toBeInTheDocument();
  
    const c5Square = screen.getByTitle('c5');
    expect(c5Square).toBeInTheDocument();

    expect(c5Square).toBe(b5Square.nextSibling);
  });

  it('starts a ResizeObserver after mounting and disconnects before unmounting', () => {
    const { unmount } = render(<Main />);
    expect(global.resizeObserverMethods.observe).toHaveBeenCalled();
    expect(global.resizeObserverMethods.disconnect).not.toHaveBeenCalled();
    unmount();
    expect(global.resizeObserverMethods.disconnect).toHaveBeenCalled();
  });

  it('makes random moves and updates visit counts when the user presses the start button', () => {
    jest.useFakeTimers();
    const startButton = screen.getByText('Start');
    expect(startButton).toBeInTheDocument();
    expect(global.setInterval).not.toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(screen.getAllByText('1')).toHaveLength(1);
    // default interval is 500 ms
    jest.advanceTimersByTime(600);
    expect(screen.getAllByText('1')).toHaveLength(2);
    jest.advanceTimersByTime(500);
    const board = screen.getByRole('table');
    const totalCount = getTotalCount(board);
    expect(totalCount).toBe(3);
    jest.clearAllTimers();
  });

  it('stops moving and updating visit counts when the user presses stop after starting', () => {
    jest.useFakeTimers();
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    jest.advanceTimersByTime(600);
    expect(screen.getAllByText('1')).toHaveLength(2);
    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);
    jest.advanceTimersByTime(500);
    expect(screen.getAllByText('1')).toHaveLength(2);
    jest.clearAllTimers();
  });

  it('lets the user change speed while moving', () => {
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(screen.getAllByText('1')).toHaveLength(1);
    jest.advanceTimersByTime(550);
    expect(screen.getAllByText('1')).toHaveLength(2);
    const speedSelect = screen.getByRole('combobox', { name: 'Speed' });
    fireEvent.change(speedSelect, { target: { value: 'Gallop' } });
    jest.advanceTimersByTime(650);
    const totalCount = getTotalCount(screen.getByRole('table'));
    expect(totalCount).toBe(8);
    jest.clearAllTimers();
  });

  it('hides the knight while moving at warp speed', async () => {
    jest.useFakeTimers();
    const board = screen.getByRole('table');
    const startButton = screen.getByText('Start');
    const speedSelect = screen.getByLabelText('Speed');
    fireEvent.change(speedSelect, { target: { value: 'Warp' } });
    fireEvent.click(startButton);
    await waitFor(() => {
      expect(screen.queryByAltText('Knight')).toBeNull();
    });
    jest.advanceTimersByTime(500);
    const squares = within(board).getAllByText(/^\d+$/);
    const counts = squares.map(squareEl => parseInt(squareEl.innerHTML, 10));
    const total = counts.reduce((acc, val) => acc + val);
    expect(total).toBe(501);
    jest.clearAllTimers();
  });

  it('resets the visit counts and stops moving when the user presses reset', () => {
    jest.useFakeTimers();
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    jest.advanceTimersByTime(600);
    expect(screen.getAllByText('1')).toHaveLength(2);
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(screen.getAllByText('1')).toHaveLength(1);
    jest.advanceTimersByTime(500);
    expect(screen.getAllByText('1')).toHaveLength(1);
    jest.clearAllTimers();
  });

  it('allows the user to show and hide the knight', async () => {
    const knight = screen.getByAltText('Knight');
    expect(knight).toBeVisible();
    const showKnightCheckbox = screen.getByRole('checkbox', { name: 'Knight' });
    fireEvent.click(showKnightCheckbox);
    expect(knight).not.toBeVisible();
    fireEvent.click(showKnightCheckbox);
    await waitFor(() => {
      expect(screen.getByAltText('Knight')).toBeVisible();
    });
  });
});
