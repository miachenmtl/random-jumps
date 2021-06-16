import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleEl = screen.getByText(/Random Knight Jumps/i);
  expect(titleEl).toBeInTheDocument();
});
