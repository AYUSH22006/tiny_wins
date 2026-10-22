import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Tiny Wins UI - Page Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header, badge, and subtitle correctly', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    render(<Home />);

    expect(screen.getByRole('heading', { level: 1, name: /tiny wins/i })).toBeInTheDocument();
    expect(
      screen.getByText(/a quiet space to celebrate everyday victories/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading wins/i)).not.toBeInTheDocument();
    });
  });

  it('displays the 150-character limit counter and "Celebrate!" button', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    render(<Home />);

    expect(screen.getByText('150 characters left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /celebrate!/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading wins/i)).not.toBeInTheDocument();
    });
  });

  it('prevents submission and displays an error when submitting empty or whitespace text', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    render(<Home />);

    // Wait for initial fetch to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading wins/i)).not.toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /celebrate!/i });
    const textarea = screen.getByPlaceholderText(/what's your tiny win today\?/i);

    // Type whitespace
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText('Please enter a win before celebrating!')
    ).toBeInTheDocument();

    // Ensure insert was never called
    expect(supabase.from).not.toHaveBeenCalledWith(
      'wins',
      expect.objectContaining({ insert: expect.anything() })
    );
  });

  it('fetches and renders existing wins from the Supabase database on mount', async () => {
    const mockWins = [
      {
        id: 1,
        content: 'Fixed a stubborn hydration bug in React!',
        created_at: '2026-10-22T08:30:00.000Z',
      },
      {
        id: 2,
        content: 'Completed morning run.',
        created_at: '2026-10-21T07:15:00.000Z',
      },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockWins, error: null }),
      }),
    });

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText('Fixed a stubborn hydration bug in React!')
      ).toBeInTheDocument();
      expect(screen.getByText('Completed morning run.')).toBeInTheDocument();
      expect(screen.getByText('2 wins shared')).toBeInTheDocument();
    });
  });

  it('successfully submits a valid win, sends it to Supabase, and updates the UI', async () => {
    const newWin = {
      id: 10,
      content: 'Shipped my project to GitHub!',
      created_at: '2026-10-22T14:00:00.000Z',
    };

    const mockInsertSelect = jest.fn().mockResolvedValue({
      data: [newWin],
      error: null,
    });
    const mockInsert = jest.fn().mockReturnValue({ select: mockInsertSelect });

    supabase.from.mockImplementation((table) => {
      if (table === 'wins') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
          insert: mockInsert,
        };
      }
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/loading wins/i)).not.toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/what's your tiny win today\?/i);
    const submitButton = screen.getByRole('button', { name: /celebrate!/i });

    // Type a valid win
    fireEvent.change(textarea, { target: { value: 'Shipped my project to GitHub!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Ensure Supabase insert was called with the trimmed content
      expect(mockInsert).toHaveBeenCalledWith([
        { content: 'Shipped my project to GitHub!' },
      ]);
      // Ensure the win is now visible on the board
      expect(screen.getByText('Shipped my project to GitHub!')).toBeInTheDocument();
      // Ensure textarea was cleared
      expect(textarea.value).toBe('');
    });
  });

  it('allows deleting a celebration and removes it from the list', async () => {
    const existingWins = [
      {
        id: 42,
        content: 'Finished reading a book chapter.',
        created_at: '2026-10-22T09:00:00.000Z',
      },
    ];

    const mockEq = jest.fn().mockResolvedValue({ error: null });
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });

    supabase.from.mockImplementation((table) => {
      if (table === 'wins') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: existingWins, error: null }),
          }),
          delete: mockDelete,
        };
      }
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Finished reading a book chapter.')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /delete win/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 42);
      expect(
        screen.queryByText('Finished reading a book chapter.')
      ).not.toBeInTheDocument();
    });
  });
});
