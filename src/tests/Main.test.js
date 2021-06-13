import { render, screen } from '@testing-library/react'

import Main from '../container/Main';

describe('The Main container', () => {
  it('renders without breaking', () => {
    const main = render(<Main />);
    expect(main).toBeDefined();
  });

  it('renders the a1 square correctly', () => {
    render(<Main />);
    const squareEl = screen.getByTitle('a1');
    expect(squareEl).toBeInTheDocument();
  });

  it('renders the a1 square with a dark background', () => {
    render(<Main />);
    const squareEl = screen.getByTitle('a1');
    const style = window.getComputedStyle(squareEl);
    expect(style.backgroundColor).toBe('blue');
  });

  it('renders the b3 square with a light background', () => {
    render(<Main />);
    const squareEl = screen.getByTitle('b3');
    const style = window.getComputedStyle(squareEl);
    expect(style.backgroundColor).toBe('antiquewhite');
  });
});