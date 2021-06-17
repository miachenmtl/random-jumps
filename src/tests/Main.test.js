import { render, screen } from '@testing-library/react'

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
});
