import { render, screen, fireEvent } from '@testing-library/react'

import Main from '../container/Main';

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
    const totalOneCounts = screen.getAllByText('1').length;
    const totalTwoCounts = screen.queryAllByText('2').length;
    expect(totalOneCounts + 2 * totalTwoCounts).toBe(3);
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
});
