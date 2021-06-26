import { fireEvent, render, screen } from '@testing-library/react';
import Panel from '../container/Panel';

const defaultProps = {
  makeRandomMoves: () => {},
  resetBoard: () => {},
  interval: 500,
  speedNames: ['Slow', 'Fast'],
  speedIndex: 0,
  setSpeed: () => {},
  displaySettings: {
    showKnight: true,
    showCounts: true,
    showPercent: false,
    showHeatmap: false
  },
  isMoving: false,
  setIsMoving: () => {}
}

describe('The Panel component', () => {
  it('renders a Start button', () => {
    render(<Panel {...defaultProps} />);
    const startButton = screen.getByText('Start');
    expect(startButton).toBeInTheDocument();
  });

  it('disables the start button and enables stop button after clicking', () => {
    jest.useFakeTimers();
    let isMoving = false;
    const setIsMoving = (bool) => { isMoving = bool; };
    const { rerender } = render(<Panel
      {...defaultProps} 
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    const startButton = screen.getByText('Start');
    const stopButton = screen.getByText('Stop');
    expect(startButton).not.toHaveAttribute('disabled');
    expect(stopButton).toHaveAttribute('disabled');
    fireEvent.click(startButton);
    jest.advanceTimersByTime(600);
    rerender(<Panel
      {...defaultProps}
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    expect(startButton).toHaveAttribute('disabled');
    expect(stopButton).not.toHaveAttribute('disabled');
    jest.clearAllTimers();
  });

  it('starts an interval timer to move the knight when the user clicks start', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    render(<Panel
      {...defaultProps} 
      makeRandomMoves={spy}
    />);
    const startButton = screen.getByText('Start');
    expect(global.setInterval).not.toHaveBeenCalled();
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(600);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(2);
    jest.clearAllTimers();
  });

  it('lets the user speed up the knight moves', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    render(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      interval={200}
    />);
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(600);
    expect(spy).toHaveBeenCalledTimes(5);
    jest.clearAllTimers();
  });

  it('lets the user speed up the knight moves a lot with batched updates', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    render(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      interval={1}
    />);
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(550);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith(100);
    expect(spy).toHaveBeenLastCalledWith(100);
    jest.advanceTimersByTime(600);
    expect(spy).toHaveBeenCalledTimes(11);
    jest.clearAllTimers();
  });

  it('lets the user speed up the knight while already moving', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    let isMoving = false;
    const setIsMoving = (bool) => { isMoving = bool; };
    const { rerender } = render(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      interval={500}
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(550);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
    // imperatively changing interval, Main tests UI
    rerender(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      interval={100}
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    jest.advanceTimersByTime(650);
    rerender(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      interval={100}
    />);
    expect(spy).toHaveBeenCalledTimes(7);
    jest.clearAllTimers();
  });


  it('stops the interval timer and the knight when the user clicks stop', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    let isMoving = false;
    const setIsMoving = (bool) => { isMoving = bool; };
    const { rerender } = render(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    const startButton = screen.getByText('Start');
    const stopButton = screen.getByText('Stop');
    fireEvent.click(startButton);
    expect(global.setInterval).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(600);
    rerender(<Panel
      {...defaultProps}
      makeRandomMoves={spy}
      isMoving={isMoving}
      setIsMoving={setIsMoving}
    />);
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.click(stopButton);
    expect(global.clearInterval).toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.clearAllTimers();
  });

  it('calls resetBoard when user clicks reset and stops moving if needed', () => {
    const resetSpy = jest.fn();
    const setIsMovingSpy = jest.fn();
    const { rerender } = render(<Panel
      {...defaultProps}
      resetBoard={resetSpy}
      setIsMoving={setIsMovingSpy}
    />);
    expect(resetSpy).not.toHaveBeenCalled();
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(resetSpy).toHaveBeenCalled();
    expect(setIsMovingSpy).not.toHaveBeenCalled();
    rerender(<Panel
      {...defaultProps}
      resetBoard={resetSpy}
      isMoving={true}
      setIsMoving={setIsMovingSpy}
    />);
    fireEvent.click(resetButton);
    expect(resetSpy).toHaveBeenCalledTimes(2);
    expect(setIsMovingSpy).toHaveBeenCalledWith(false);
  });

  it('does not clear the interval timer when unmounting if not needed', () => {
    jest.useFakeTimers();
    const { unmount } = render(<Panel {...defaultProps} />);
    expect(global.clearInterval).not.toHaveBeenCalled();
    unmount(); // timer not started
    expect(global.clearInterval).not.toHaveBeenCalled();
    jest.clearAllTimers();
  });

  it('clears the interval timer when unmounting if needed', () => {
    jest.useFakeTimers();
    const { unmount } = render(<Panel {...defaultProps} />);
    expect(global.clearInterval).not.toHaveBeenCalled();
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    unmount();
    expect(global.clearInterval).toHaveBeenCalled();
    jest.clearAllTimers();
  });
});
