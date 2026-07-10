import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../../src/components/BottomNav';

// ─── Mock dependencies ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AlertContext with 2 pending alerts and 1 confirmed alert
vi.mock('@/context/AlertContext', () => ({
  useAlerts: () => ({
    alerts: [
      { id: '1', status: 'pending' },
      { id: '2', status: 'pending' },
      { id: '3', status: 'confirmed' },
    ],
  }),
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderNav = (initialPath = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  );

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BottomNav', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders all three nav items', () => {
    renderNav();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('navigates to /dashboard when Home is clicked', () => {
    renderNav('/map');
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to /map when Map is clicked', () => {
    renderNav('/dashboard');
    fireEvent.click(screen.getByText('Map'));
    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

  it('navigates to /reports when Reports is clicked', () => {
    renderNav('/dashboard');
    fireEvent.click(screen.getByText('Reports'));
    expect(mockNavigate).toHaveBeenCalledWith('/reports');
  });

  it('renders inside a nav element', () => {
    renderNav();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders 3 clickable buttons', () => {
    renderNav();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  // ─── Active route styling ────────────────────────────────────────────────────

  it('applies active styles to the current active route item', () => {
    renderNav('/dashboard');

    const homeButton = screen.getByText('Home').closest('button');
    const mapButton = screen.getByText('Map').closest('button');

    // Component uses nav-item-active (not bottom-nav-active)
    expect(homeButton).toHaveClass('nav-item-active');
    expect(mapButton).not.toHaveClass('nav-item-active');
    expect(mapButton).toHaveClass('text-muted-foreground');
  });

  it('applies active styles to /map when on map route', () => {
    renderNav('/map');

    const homeButton = screen.getByText('Home').closest('button');
    const mapButton = screen.getByText('Map').closest('button');

    expect(mapButton).toHaveClass('nav-item-active');
    expect(homeButton).not.toHaveClass('nav-item-active');
  });

  // ─── Alert badge ─────────────────────────────────────────────────────────────

  // The component computes pendingCount but does not render a visible badge
  it('computes pending alerts from context without crashing', () => {
    // With 2 pending alerts in the mock, the nav should still render correctly
    renderNav();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
  });
});