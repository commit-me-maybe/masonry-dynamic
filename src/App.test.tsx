import { render, fireEvent } from '@testing-library/react';
import App from './App';
import * as calculateColumnsModule from './utils/calculateColumnsCount';

jest.mock('lodash', () => ({
  debounce: (fn: Function) => fn,
}));

jest.mock('./utils/calculateColumnsCount', () => ({
  calculateColumnCount: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (calculateColumnsModule.calculateColumnCount as jest.Mock).mockReturnValue(
      3
    );
  });

  it('renders MasonryGrid with initial column count', () => {
    render(<App />);
    expect(calculateColumnsModule.calculateColumnCount).toHaveBeenCalledWith(
      window.innerWidth
    );
  });

  it('updates column count when window is resized', () => {
    render(<App />);

    expect(calculateColumnsModule.calculateColumnCount).toHaveBeenCalledTimes(
      1
    );

    window.innerWidth = 800;
    fireEvent(window, new Event('resize'));

    expect(calculateColumnsModule.calculateColumnCount).toHaveBeenCalledTimes(
      2
    );
    expect(
      calculateColumnsModule.calculateColumnCount
    ).toHaveBeenLastCalledWith(800);
  });

  it('removes resize event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<App />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
