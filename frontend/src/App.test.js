import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { ProtectedRoutes } from './App';

jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Signup', () => () => <div>Signup Page</div>);
jest.mock('react-hot-toast', () => ({
  Toaster: () => null,
  toast: { success: jest.fn(), error: jest.fn() },
}));

afterEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
describe('ProtectedRoutes', () => {
  test('renders children when a user is stored in localStorage', () => {
    localStorage.setItem('User', JSON.stringify({ name: 'Alice' }));

    render(
      <MemoryRouter>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('does not render children when localStorage has no User', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoutes>
          <div>Secret Content</div>
        </ProtectedRoutes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  test('renders multiple children when authenticated', () => {
    localStorage.setItem('User', JSON.stringify({ name: 'Bob' }));

    render(
      <MemoryRouter>
        <ProtectedRoutes>
          <span>Child A</span>
          <span>Child B</span>
        </ProtectedRoutes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Child B')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
describe('App routing', () => {
  test('renders Login page at /login when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders Signup page at /signup', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
  });

  test('redirects to /login at / when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    // Unauthenticated → redirected to /login → Login page shown
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders Home page at / when authenticated', () => {
    localStorage.setItem('User', JSON.stringify({ name: 'Alice' }));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
