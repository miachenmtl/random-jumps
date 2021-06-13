import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleEl = screen.getByText(/Random Jumps/i);
  expect(titleEl).toBeInTheDocument();
});
