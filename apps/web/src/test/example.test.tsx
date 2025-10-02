import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

/**
 * Example test - demonstrates testing pattern
 * Replace with actual tests
 */

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Roster Manager')).toBeInTheDocument();
  });
});
