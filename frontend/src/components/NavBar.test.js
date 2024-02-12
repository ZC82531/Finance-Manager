import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

// Stub out react-top-loading-bar since it doesn't behave well in jsdom.
jest.mock('react-top-loading-bar', () => {
  const React = require('react');
  const MockLoadingBar = React.forwardRef((_props, ref) => {
    // Expose the methods the component calls via ref.
    React.useImperativeHandle(ref, () => ({
      staticStart: jest.fn(),
      complete: jest.fn(),
    }));
    return React.createElement('div', { 'data-testid': 'loading-bar' });
  });
  // __esModule: true tells Jest this mock has an ES-module default export,
  // which matches how NavBar.js imports it: import LoadingBar from '...'
  return { __esModule: true, default: MockLoadingBar };
});

// Stub react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Stub useNavigate so we can assert it was called during logout.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const renderNavBar = () =>
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

describe('NavBar rendering', () => {
  test('renders the brand name "Expense"', () => {
    renderNavBar();
    expect(screen.getByText('Expense')).toBeInTheDocument();
  });

  test('renders the "Expense Tracker" text', () => {
    renderNavBar();
    expect(screen.getByText('Tracker')).toBeInTheDocument();
  });

  test('renders the "Log Out" link', () => {
    renderNavBar();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  test('renders the loading bar element', () => {
    renderNavBar();
    expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
  });
});

describe('NavBar logout behaviour', () => {
  test('removes User from localStorage when Log Out is clicked', async () => {
    localStorage.setItem('User', JSON.stringify({ name: 'Alice' }));
    renderNavBar();

    fireEvent.click(screen.getByText('Log Out'));

    expect(localStorage.getItem('User')).toBeNull();
  });

  test('navigates to /login after logging out', async () => {
    localStorage.setItem('User', JSON.stringify({ name: 'Alice' }));
    renderNavBar();

    fireEvent.click(screen.getByText('Log Out'));

    // Allow async operations to flush
    await new Promise((r) => setTimeout(r, 0));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
